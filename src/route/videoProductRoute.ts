import { Hono } from "hono";
import { getVideoproduct, postVideoproduct } from "../controllers/videoproductController.js";
const VideoProductRoutes = new Hono()
VideoProductRoutes.get("/", getVideoproduct)
VideoProductRoutes.post("/", postVideoproduct)
export default VideoProductRoutes
