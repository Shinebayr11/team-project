import { Hono } from "hono";
import { getOrder, postOrder } from "../controllers/orderController.js";

const orderRoutes = new Hono()
orderRoutes.get("/", getOrder)
orderRoutes.post("/", postOrder)
export default orderRoutes
