import { Hono } from "hono";
import { getliveshow, getliveshowById, getMyLiveshows, patchliveshow, postliveshow, getParticipants, getAccessToken } from "../controllers/liveshowController.js";
import { requireAuth } from "../middleware/auth.js";

const liveshowRoutes = new Hono()
liveshowRoutes.get("/", getliveshow)
// /:id-с өмнө байх ёстой, эс тэгвэл "mine" нь id параметр гэж танигдана.
liveshowRoutes.get("/mine", requireAuth, getMyLiveshows)
liveshowRoutes.get("/:id/participants", getParticipants)
liveshowRoutes.post("/:id/token", getAccessToken)
liveshowRoutes.get("/:id", getliveshowById)
liveshowRoutes.post("/", requireAuth, postliveshow)
liveshowRoutes.patch("/:id", requireAuth, patchliveshow)
export default liveshowRoutes
