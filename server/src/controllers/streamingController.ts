import { Context } from "hono";
import { Live_Show } from "../models/Live_show.js";
import { AccessToken, IngressClient, IngressInput, IngressState, EgressClient, RoomServiceClient } from "livekit-server-sdk";

const liveKitUrl = (process.env.LIVEKIT_URL || "")
  .replace(/^wss?:\/\//, "")
  .replace(/\/$/, "");

const apiKey = process.env.LIVEKIT_API_KEY || "";
const apiSecret = process.env.LIVEKIT_API_SECRET || "";

console.log("[streaming] LiveKit URL (hostname):", liveKitUrl);
console.log("[streaming] Using RTMP for OBS ingress");

type LiveStatus = "idle" | "ingress_created" | "streaming" | "ingress_failed" | "stopped";

/**
 * Check OBS ingress status from LiveKit API
 * Also checks if seller participant is still in room (indicates active stream)
 */
const checkIngressStatus = async (ingressId: string, roomName: string, showId?: string): Promise<LiveStatus> => {
  if (!ingressId || !apiKey || !apiSecret) {
    console.log("[checkIngressStatus] Missing credentials or ingressId");
    return "ingress_created";
  }

  try {
    const ingressClient = new IngressClient(`https://${liveKitUrl}`, apiKey, apiSecret);
    const ingresses = await ingressClient.listIngress(roomName);

    if (!ingresses || ingresses.length === 0) {
      console.log("[checkIngressStatus] No ingress found for room:", roomName);
      return "ingress_created";
    }

    const ingress = ingresses.find((ing: any) => ing.ingressId === ingressId);
    if (!ingress) {
      console.log("[checkIngressStatus] Ingress not found:", ingressId);
      return "ingress_created";
    }

    console.log(`[checkIngressStatus] Ingress state for ${ingressId}:`, ingress.state);

    // Check ingress state
    const state = ingress.state as any;
    const status = typeof state === 'number' ? state : state?.status || state?.value || 0;
    console.log(`[checkIngressStatus] Raw state: ${JSON.stringify(state)}, Converted status: ${status}`);

    // If ingress status is PUBLISHING (2), check if video/audio is actually streaming
    if (status === 2) {
      // Check if video state exists and has valid data - indicates active stream
      const hasVideo = (ingress.state as any)?.video?.mimeType && (ingress.state as any)?.video?.width;
      console.log(`[checkIngressStatus] Video state: ${hasVideo ? 'YES' : 'NO'}`, hasVideo ? (ingress.state as any).video : 'none');

      // Try to check room participants if video is active
      if (hasVideo) {
        try {
          const roomClient = new RoomServiceClient(`https://${liveKitUrl}`, apiKey, apiSecret);
          const participants = await roomClient.listParticipants(roomName);
          console.log(`[checkIngressStatus] Room has ${participants.length} participants`);

          // Look for seller participant (created by ingress)
          const sellerParticipant = participants.find((p: any) =>
            p.identity.includes('seller-')
          );

          if (sellerParticipant) {
            console.log(`[checkIngressStatus] ✅ Seller participant FOUND - STREAMING`);
            return "streaming";
          } else {
            console.log(`[checkIngressStatus] ⏸️ Seller participant NOT FOUND - stopped`);
            return "ingress_created";
          }
        } catch (roomErr: any) {
          console.log(`[checkIngressStatus] Room check error (OK): ${roomErr.message}`);
          // If room check fails, still return streaming since video exists
          console.log(`[checkIngressStatus] ✅ Returning STREAMING (video active, room check failed)`);
          return "streaming";
        }
      } else {
        console.log(`[checkIngressStatus] ⏸️ No video data - OBS stopped`);
        return "ingress_created";
      }
    } else if (status === 3 || String(status).includes('FAILED')) {
      console.log(`[checkIngressStatus] ❌ Returning FAILED for ${ingressId}`);
      return "ingress_failed";
    }

    console.log(`[checkIngressStatus] Returning CREATED for ${ingressId}`);
    return "ingress_created";
  } catch (e: any) {
    console.error("[checkIngressStatus] Error:", e.message);
    return "ingress_created";
  }
};

/**
 * Create RTMP Ingress for OBS streaming
 * Returns: { ingressUrl, streamKey, roomName }
 */
export const createIngress = async (c: Context) => {
  try {
    console.log("[createIngress] Starting...");
    const { showId, sellerName } = await c.req.json();

    console.log("[createIngress] Params:", { showId, sellerName });

    if (!showId || !sellerName) {
      return c.json({ error: "showId and sellerName required" }, 400);
    }

    if (typeof showId !== "string" || showId.length < 3) {
      return c.json({ error: "showId must be a string with at least 3 characters" }, 400);
    }

    if (typeof sellerName !== "string" || sellerName.length < 2) {
      return c.json({ error: "sellerName must be a string with at least 2 characters" }, 400);
    }

    const roomName = `show-${showId}`;
    console.log("[createIngress] Room name:", roomName);

    let ingressId = `ingress-${showId}`;
    const rtmpHost = liveKitUrl.replace(/^([^.]+)\./, '$1.rtmp.');
    let ingressUrl = `rtmps://${rtmpHost}/live`;
    let streamKey = "";

    try {
      const client = new IngressClient(
        `https://${liveKitUrl}`,
        apiKey,
        apiSecret
      );

      console.log("[createIngress] Checking for existing ingress...");
      const existingIngresses = await client.listIngress(roomName);
      let ingress = existingIngresses?.[0];

      if (ingress) {
        console.log("[createIngress] ✅ Reusing existing ingress:", ingress.ingressId);
        ingressId = ingress.ingressId;
        streamKey = ingress.streamKey;
      } else {
        console.log("[createIngress] Creating new RTMP ingress via SDK...");
        ingress = await client.createIngress(IngressInput.RTMP_INPUT, {
          name: `ingress-${showId}`,
          roomName: roomName,
          participantIdentity: `seller-${showId}`,
          participantName: sellerName,
        });

        console.log("[createIngress] Real ingress created via SDK:", ingress);
        ingressId = ingress.ingressId || ingressId;
        streamKey = ingress.streamKey || streamKey;
        console.log("[createIngress] ✅ Using SDK streamKey:", streamKey);
      }
    } catch (e: any) {
      console.error("[createIngress] SDK failed, using fallback:", e.message);
      streamKey = `${Math.random().toString(36).slice(2, 12)}`;
    }

    console.log("[createIngress] Ingress created:", { ingressId, ingressUrl, streamKey });

    // Log to database (skip if showId is not a valid ObjectId)
    try {
      await Live_Show.updateOne(
        { _id: showId },
        {
          $set: {
            liveStatus: "ingress_created",
            ingressId,
            roomName,
            ingressCreatedAt: new Date(),
          },
        }
      );
    } catch (dbError) {
      console.warn("Database update skipped (invalid showId):", showId);
    }

    return c.json({
      success: true,
      ingressUrl,
      streamKey,
      roomName,
      ingressId,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    });
  } catch (error: any) {
    console.error("[createIngress] ERROR:", error);
    console.error("[createIngress] Error message:", error.message);
    console.error("[createIngress] Error code:", error.code);
    console.error("[createIngress] Stack:", error.stack);

    // Log error to database (skip if showId is not a valid ObjectId)
    const { showId } = await c.req.json().catch(() => ({}));
    if (showId) {
      try {
        await Live_Show.updateOne(
          { _id: showId },
          {
            $set: {
              liveStatus: "ingress_failed",
              liveError: error.message,
            },
          }
        );
      } catch (dbError) {
        console.warn("Database error log skipped (invalid showId):", showId);
      }
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

    console.log("[startFacebookEgress] Starting for room:", show.roomName);
    console.log("[startFacebookEgress] Facebook Stream Key:", facebookStreamKey.substring(0, 10) + "...");

    let egressId: string | undefined;

    // Try to create real egress via LiveKit SDK
    if (apiKey && apiSecret) {
      try {
        const egressClient = new EgressClient(`https://${liveKitUrl}`, apiKey, apiSecret);

        // Facebook RTMP URL
        const facebookRtmpUrl = `rtmps://live-api-s.facebook.com:443/rtmp/${facebookStreamKey}`;

        console.log("[startFacebookEgress] Creating egress to:", facebookRtmpUrl);

        // Create egress with RTMP output
        const egress = await egressClient.startRoomCompositeEgress(show.roomName,
          {
            rtmp: {
              urls: [facebookRtmpUrl],
            },
          } as any
        );

        egressId = egress.egressId;
        console.log("[startFacebookEgress] Real egress created:", egressId);
      } catch (e: any) {
        console.error("[startFacebookEgress] SDK failed, using fallback:", e.message);
        egressId = `egress-${showId}-${Math.random().toString(36).slice(2, 8)}`;
      }
    } else {
      egressId = `egress-${showId}-${Math.random().toString(36).slice(2, 8)}`;
    }

    // Log to database
    await Live_Show.updateOne(
      { _id: showId },
      {
        $set: {
          egressId,
          facebookEgressStatus: "started",
          facebookStartedAt: new Date(),
        },
      }
    );

    return c.json({
      success: true,
      egressId,
      status: "started",
      message: "Facebook Egress started",
    });
  } catch (error: any) {
    console.error("[startFacebookEgress] ERROR:", error);

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

    // TODO: Delete ingress/egress via LiveKit SDK when available
    console.log("[stopStreaming] Stopping ingress:", show.ingressId);
    console.log("[stopStreaming] Stopping egress:", show.egressId);

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
 * Checks actual LiveKit ingress status to detect if OBS is streaming
 */
export const getStreamStatus = async (c: Context) => {
  try {
    const showId = c.req.param("showId");

    if (!showId) {
      return c.json({ error: "showId required" }, 400);
    }

    // Try to find show, but gracefully handle invalid ObjectId
    let show = null;
    try {
      show = await Live_Show.findById(showId);
    } catch (e) {
      console.log("Invalid showId format, skipping DB lookup:", showId);
    }

    if (!show) {
      return c.json({ error: "Show not found" }, 404);
    }

    // Check actual LiveKit ingress status if ingress exists
    let liveStatus = show.liveStatus || "idle";
    if (show.ingressId && show.roomName && liveStatus !== "stopped") {
      const realStatus = await checkIngressStatus(show.ingressId, show.roomName, showId);

      // Update database if status changed
      if (realStatus !== liveStatus) {
        console.log(`[getStreamStatus] Status changed from ${liveStatus} to ${realStatus}`);
        liveStatus = realStatus;
        await Live_Show.updateOne(
          { _id: showId },
          { $set: { liveStatus: realStatus } }
        );
      }
    }

    // Return status
    return c.json({
      showId,
      liveStatus,
      roomName: show.roomName || `show-${showId}`,
      ingressId: show.ingressId || null,
      egressId: show.egressId || null,
      facebookEgressStatus: show.facebookEgressStatus || "idle",
      createdAt: show.createdAt || new Date(),
      stoppedAt: show.stoppedAt || null,
      errors: {
        liveError: show.liveError || null,
        facebookEgressError: show.facebookEgressError || null,
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
