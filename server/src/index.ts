import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { connectDb } from "./lib/db.js";

import livekit from "./livekit.js";
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

const app = new Hono();

connectDb();

app.use("*", cors({ origin: "*" }));

app.get("/", (c) => {
  return c.text("Server is running successfully! 🚀");
});

app.route("/livekit", livekit);
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
app.route("/sellers", sellerRoutes)
serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Сервер http://localhost:${info.port}`);
  }
);

export default app;
