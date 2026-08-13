import { Hono } from "hono";
import { getVideo, postVideo } from "../controllers/VideoController.js";
const videoRoutes = new Hono()
videoRoutes.get("/", getVideo)
videoRoutes.post("/", postVideo)
export default videoRoutes