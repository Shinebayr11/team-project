import { Hono } from "hono";
import { getMyOrders, getOrder, postOrder } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js";

const orderRoutes = new Hono()
// Захиалга бүхэлдээ хувийн өгөгдөл (нэр, хаяг, утас) тул нээлттэй зам БАЙХГҮЙ.
// `/mine` нь `/`-ээс ӨМНӨ — Hono дараалалаар тааруулдаг.
orderRoutes.get("/mine", requireAuth, getMyOrders)
orderRoutes.get("/", requireAuth, getOrder)
orderRoutes.post("/", requireAuth, postOrder)
export default orderRoutes
