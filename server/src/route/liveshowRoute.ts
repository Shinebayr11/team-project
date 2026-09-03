import { Hono } from "hono";
import { getliveshow, getliveshowById, getMyLiveshows, patchliveshow, postliveshow, getParticipants, getAccessToken } from "../controllers/liveshowController.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const liveshowRoutes = new Hono()
liveshowRoutes.get("/", getliveshow)
// /:id-с өмнө байх ёстой, эс тэгвэл "mine" нь id параметр гэж танигдана.
liveshowRoutes.get("/mine", requireAuth, getMyLiveshows)
liveshowRoutes.get("/:id/participants", getParticipants)
// Шууд дамжуулалт үзэх нь бүгдэд нээлттэй тул нэвтрэлт заавал биш — нэвтэрсэн
// бол зөвхөн харагдах нэрийг нь профайлаас авахад ашиглана.
liveshowRoutes.post("/:id/token", optionalAuth, getAccessToken)
liveshowRoutes.get("/:id", getliveshowById)
liveshowRoutes.post("/", requireAuth, postliveshow)
liveshowRoutes.patch("/:id", requireAuth, patchliveshow)
export default liveshowRoutes
