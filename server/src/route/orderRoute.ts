import { Hono } from "hono";
import { getMyOrders, getMySellerOrders, getOrder, postOrder } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js";

const orderRoutes = new Hono()
// Тодорхой зам "/"-ээс өмнө байх ёстой (`productRoute.ts`-тэй адил дараалал).
orderRoutes.get("/mine", requireAuth, getMyOrders)
orderRoutes.get("/seller", requireAuth, getMySellerOrders)
orderRoutes.get("/", getOrder)
orderRoutes.post("/", requireAuth, postOrder)
export default orderRoutes
