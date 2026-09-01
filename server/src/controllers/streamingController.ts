import { Context } from "hono";
import { IngressClient, IngressInput, EgressClient } from "livekit-server-sdk";
import { Live_Show } from "../models/Live_show.js";

const ingressClient = new IngressClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

const egressClient = new EgressClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

/**
 * Create RTMP Ingress for OBS streaming
 * Returns: { ingressUrl, streamKey, roomName }
 */
export const createIngress = async (c: Context) => {
  try {
    const { showId, sellerName } = await c.req.json();

    if (!showId || !sellerName) {
      return c.json({ error: "showId and sellerName required" }, 400);
    }

    const roomName = `show-${showId}`;

    // Create RTMP Ingress via LiveKit
    const ingress = await ingressClient.createIngress(IngressInput.RTMP_INPUT, {
      name: `ingress-${showId}`,
      roomName,
      participantIdentity: `seller-${showId}`,
      participantName: sellerName,
      bypassTranscoding: false, // Enable transcoding for stability
    });

    // Log to database
    await Live_Show.updateOne(
      { _id: showId },
      {
        $set: {
          liveStatus: "ingress_created",
          ingressId: ingress.ingressId,
          roomName,
          ingressCreatedAt: new Date(),
        },
      }
    );

    return c.json({
      success: true,
      ingressUrl: `rtmp://${ingress.url}/live`,
      streamKey: ingress.streamKey,
      roomName,
      ingressId: ingress.ingressId,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    });
  } catch (error: any) {
    console.error("CreateIngress error:", error);

    // Log error to database
    const { showId } = await c.req.json().catch(() => ({}));
    if (showId) {
      await Live_Show.updateOne(
        { _id: showId },
        {
          $set: {
            liveStatus: "ingress_failed",
            liveError: error.message,
          },
        }
      );
    }

    return c.json(
      { error: "Failed to create ingress", details: error.message },
      500
    );
  }
};

/**
 * Start Egress to Facebook Live
 * Called after ingress is created and OBS starts streaming
 */
export const startFacebookEgress = async (c: Context) => {
  try {
    const { showId, facebookStreamKey } = await c.req.json();

    if (!showId || !facebookStreamKey) {
      return c.json({ error: "showId and facebookStreamKey required" }, 400);
    }

    // Get ingress room from DB
    const show = await Live_Show.findById(showId);
    if (!show?.roomName) {
      return c.json({ error: "Show not found or ingress not created" }, 404);
    }

    // Create RTMP Egress to Facebook
    // LiveKit supports streaming to multiple RTMP URLs via the startRoomCompositeEgress API
    const facebookUrl = `rtmps://live-api-s.facebook.com:443/rtmp/${facebookStreamKey}`;

    const egress = await egressClient.startRoomCompositeEgress(
      show.roomName,
      {
        rtmpOutputs: [{ urls: [facebookUrl] }],
      } as any
    );

    // Log to database
    await Live_Show.updateOne(
      { _id: showId },
      {
        $set: {
          egressId: egress.egressId,
          facebookEgressStatus: "started",
          facebookStartedAt: new Date(),
        },
      }
    );

    return c.json({
      success: true,
      egressId: egress.egressId,
      status: egress.status,
      message: "Facebook Egress started",
    });
  } catch (error: any) {
    console.error("StartFacebookEgress error:", error);

    const { showId } = await c.req.json().catch(() => ({}));
    if (showId) {
      await Live_Show.updateOne(
        { _id: showId },
        {
          $set: {
            facebookEgressStatus: "failed",
            facebookEgressError: error.message,
          },
        }
      );
    }

    return c.json(
      { error: "Failed to start Facebook egress", details: error.message },
      500
    );
  }
};

/**
 * Stop streaming: Delete ingress + egress + cleanup
 */
export const stopStreaming = async (c: Context) => {
  try {
    const { showId } = await c.req.json();

    if (!showId) {
      return c.json({ error: "showId required" }, 400);
    }

    const show = await Live_Show.findById(showId);
    if (!show) {
      return c.json({ error: "Show not found" }, 404);
    }

    const errors: string[] = [];

    // Delete ingress
    if (show.ingressId) {
      try {
        await ingressClient.deleteIngress(show.ingressId);
      } catch (e: any) {
        errors.push(`Failed to delete ingress: ${e.message}`);
      }
    }

    // Delete egress
    if (show.egressId) {
      try {
        await egressClient.stopEgress(show.egressId);
      } catch (e: any) {
        errors.push(`Failed to stop egress: ${e.message}`);
      }
    }

    // Update database
    await Live_Show.updateOne(
      { _id: showId },
      {
        $set: {
          liveStatus: "stopped",
          stoppedAt: new Date(),
          ingressId: null,
          egressId: null,
        },
      }
    );

    return c.json({
      success: errors.length === 0,
      message: "Streaming stopped",
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("StopStreaming error:", error);
    return c.json(
      { error: "Failed to stop streaming", details: error.message },
      500
    );
  }
};

/**
 * Get streaming status
 */
export const getStreamStatus = async (c: Context) => {
  try {
    const { showId } = c.req.param();

    if (!showId) {
      return c.json({ error: "showId required" }, 400);
    }

    const show = await Live_Show.findById(showId);
    if (!show) {
      return c.json({ error: "Show not found" }, 404);
    }

    return c.json({
      showId,
      liveStatus: show.liveStatus,
      roomName: show.roomName,
      ingressId: show.ingressId,
      egressId: show.egressId,
      facebookEgressStatus: show.facebookEgressStatus,
      createdAt: show.createdAt,
      stoppedAt: show.stoppedAt,
      errors: {
        liveError: show.liveError,
        facebookEgressError: show.facebookEgressError,
      },
    });
  } catch (error: any) {
    console.error("GetStreamStatus error:", error);
    return c.json(
      { error: "Failed to get stream status", details: error.message },
      500
    );
  }
};
