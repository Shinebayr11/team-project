import { Hono } from "hono";
import { cors } from "hono/cors";
import { connectDb } from "./lib/db.js";

import userRoutes from "./route/userRoute.js";
import productRoutes from "./route/productRoute.js";
import categoryRoutes from "./route/categoryRoute.js";
import videoRoutes from "./route/videoRoute.js";
import liveshowRoutes from "./route/liveshowRoute.js";
import productlistingRoutes from "./route/productlistingRoute.js";
import orderRoutes from "./route/orderRoute.js";
import VideoProductRoutes from "./route/videoProductRoute.js";
import showproductRoutes from "./route/showproductRoute.js";
import bidRoutes from "./route/bidRoute.js";
import WalletRoutes from "./route/walletRoute.js";
import CointransactionRoutes from "./route/cointransactionRoute.js";
import sellerRoutes from "./route/sellerRoute.js";
import messageRoutes from "./route/messageRoute.js";
import paymentRoutes from "./route/paymentRoute.js";

const app = new Hono();

/**
 * Зөвшөөрөгдсөн домэйнууд. Клиент нь `/api/*`-ыг Next-ийн rewrite-аар өөрийн
 * домэйноороо дамжуулдаг тул хөтчөөс шууд ирэх cross-origin хүсэлт хэвийн
 * ажиллагаанд шаардлагагүй — `CORS_ORIGINS` (таслалаар тусгаарласан) зөвхөн
 * гар аргаар турших, өөр клиент холбоход л хэрэгтэй.
 *
 * Өмнө нь `origin: "*"` байсан: нэвтэрсэн хүний хөтчөөр ямар ч сайт манай
 * API-г чөлөөтэй уншиж чадах өргөн нээлттэй тохиргоо байв.
 */
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const devOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowList = allowedOrigins.length ? allowedOrigins : devOrigins;
      return allowList.includes(origin) ? origin : null;
    },
    credentials: true,
  }),
);

app.get("/", (c) => {
  return c.text("Server is running successfully! 🚀");
});

// Өгөгдлийн сан хэрэглэдэг бүх зам холболтоо хүлээнэ. Ингэснээр холболт
// унасан үед query нь буферт 10 секунд хүлээгээд бүрхэг "aldaa garlaa"
// болохын оронд, шалтгааныг нь хэлсэн шуурхай хариу буцаана.
app.use("/api/*", async (c, next) => {
  try {
    await connectDb();
  } catch (error) {
    console.error("DB холбогдсонгүй:", error);
    return c.json(
      { message: "Өгөгдлийн сантай холбогдож чадсангүй" },
      503,
    );
  }
  await next();
});

app.route("/api/users", userRoutes);
app.route("/api/product", productRoutes);
app.route("/api/category", categoryRoutes);
app.route("/api/Video", videoRoutes);
app.route("/api/liveshow", liveshowRoutes);
app.route("/api/productlisting", productlistingRoutes);
app.route("/api/order", orderRoutes);
app.route("/api/videoproduct", VideoProductRoutes);
app.route("/api/showproduct", showproductRoutes);
app.route("/api/bids", bidRoutes);
app.route("/api/wallet", WalletRoutes);
app.route("/api/cointransaction", CointransactionRoutes);
app.route("/api/payment", paymentRoutes);
// Шинэ клиент /api/seller-ийг ашиглана. /sellers нь хуучин холбоосуудад
// зориулж хэвээр үлдэв.
app.route("/api/messages", messageRoutes);
app.route("/api/seller", sellerRoutes);
app.route("/sellers", sellerRoutes);

export default app;
