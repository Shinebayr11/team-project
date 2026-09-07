import { Hono } from "hono";
import {
    getseller,
    postseller,
    activateSeller,
    updateSellerProfile,
    updateSellerSettings,
    slugAvailable,
    getMySellerProfile,
    getSellerShop,
} from "../controllers/seller.js";
import { requireAuth } from "../middleware/auth.js";

const sellerRoutes = new Hono()

sellerRoutes.get("/", getseller)
sellerRoutes.post("/apply", postseller)

// Гарын үсэг зурмагц шууд идэвхжинэ — хянах дараалал байхгүй.
sellerRoutes.post("/activate", requireAuth, activateSeller)
sellerRoutes.patch("/profile", requireAuth, updateSellerProfile)
sellerRoutes.patch("/settings", requireAuth, updateSellerSettings)
sellerRoutes.get("/slug-available", requireAuth, slugAvailable)
sellerRoutes.get("/me", requireAuth, getMySellerProfile)

// Нээлттэй: дэлгүүрийн хуудас. `/shop/` угтвартай тул дээрх замуудтай мөргөлдөхгүй.
sellerRoutes.get("/shop/:key", getSellerShop)

export default sellerRoutes
