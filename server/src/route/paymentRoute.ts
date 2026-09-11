import { Hono } from "hono";
import {
    createTopUpPayment,
    getPaymentStatus,
    wireWebhook,
} from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/auth.js";

const paymentRoutes = new Hono()
// Wire өөрөө дууддаг тул нэвтрэлтгүй — оронд нь гарын үсгээр баталгаажна.
paymentRoutes.post("/webhook", wireWebhook)
paymentRoutes.post("/topup", requireAuth, createTopUpPayment)
paymentRoutes.get("/:id", requireAuth, getPaymentStatus)
export default paymentRoutes
