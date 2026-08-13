import { Hono } from "hono";
import { getliveshow, postliveshow } from "../controllers/liveshowController.js";

const liveshowRoutes = new Hono()
liveshowRoutes.get("/", getliveshow)
liveshowRoutes.post("/", postliveshow)
export default liveshowRoutes
