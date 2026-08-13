import { Hono } from "hono";
import { getbids, postbids } from "../controllers/bidsController.js";

const bidRoutes = new Hono()
bidRoutes.get("/", getbids)
bidRoutes.post("/", postbids)
export default bidRoutes