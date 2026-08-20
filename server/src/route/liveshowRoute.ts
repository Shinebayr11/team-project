import { Hono } from "hono";
import { getliveshow, getliveshowById, patchliveshow, postliveshow } from "../controllers/liveshowController.js";
import { requireAuth } from "../middleware/auth.js";

const liveshowRoutes = new Hono()
liveshowRoutes.get("/", getliveshow)
liveshowRoutes.get("/:id", getliveshowById)
liveshowRoutes.post("/", requireAuth, postliveshow)
liveshowRoutes.patch("/:id", requireAuth, patchliveshow)
export default liveshowRoutes
