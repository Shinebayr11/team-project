import { Hono } from "hono";
import {
  createIngress,
  startFacebookEgress,
  stopStreaming,
  getStreamStatus,
} from "../controllers/streamingController.js";
import { requireAuth } from "../middleware/auth.js";

const streamingRoutes = new Hono();

/**
 * POST /api/streaming/:showId/ingress/create
 * Create OBS Ingress endpoint
 */
streamingRoutes.post("/:showId/ingress/create", requireAuth, createIngress);

/**
 * POST /api/streaming/:showId/egress/facebook
 * Start Facebook Egress (after OBS connects)
 */
streamingRoutes.post("/:showId/egress/facebook", requireAuth, startFacebookEgress);

/**
 * POST /api/streaming/:showId/stop
 * Stop ingress + egress, cleanup
 */
streamingRoutes.post("/:showId/stop", requireAuth, stopStreaming);

/**
 * GET /api/streaming/:showId/status
 * Get current streaming status
 */
streamingRoutes.get("/:showId/status", getStreamStatus);

export default streamingRoutes;
