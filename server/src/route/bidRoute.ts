import { Hono } from "hono";
import { getbids, postbids } from "../controllers/bidsController.js";
import { requireAuth } from "../middleware/auth.js";

const bidRoutes = new Hono()
bidRoutes.get("/", getbids)
// Санал өгөгчийг токеноос тогтооно — эс бөгөөс хэн ч өөр хүний нэрээр
// санал өгөх боломжтой болно.
bidRoutes.post("/", requireAuth, postbids)
export default bidRoutes
