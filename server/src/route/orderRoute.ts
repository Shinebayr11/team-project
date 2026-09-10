import { Hono } from "hono";
import {
    getMyOrders,
    getMySellerOrders,
    getOrder,
    postOrder,
    updateOrderFulfillment,
    updateOrderTracking,
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js";

const orderRoutes = new Hono()
// Тодорхой зам "/"-ээс өмнө байх ёстой (`productRoute.ts`-тэй адил дараалал).
orderRoutes.get("/mine", requireAuth, getMyOrders)
orderRoutes.get("/seller", requireAuth, getMySellerOrders)
// Захиалга бүхэлдээ хувийн өгөгдөл (нэр, хаяг, утас) тул нээлттэй зам БАЙХГҮЙ.
orderRoutes.get("/", requireAuth, getOrder)
orderRoutes.post("/", requireAuth, postOrder)
orderRoutes.patch("/:id/status", requireAuth, updateOrderFulfillment)
orderRoutes.patch("/:id/tracking", requireAuth, updateOrderTracking)
export default orderRoutes
