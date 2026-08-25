import { Hono } from "hono";
import {
    getseller,
    postseller,
    activateSeller,
    slugAvailable,
    getMySellerProfile,
} from "../controllers/seller.js";
import { requireAuth } from "../middleware/auth.js";

const sellerRoutes = new Hono()

sellerRoutes.get("/", getseller)
sellerRoutes.post("/apply", postseller)

// Гарын үсэг зурмагц шууд идэвхжинэ — хянах дараалал байхгүй.
sellerRoutes.post("/activate", requireAuth, activateSeller)
sellerRoutes.get("/slug-available", requireAuth, slugAvailable)
sellerRoutes.get("/me", requireAuth, getMySellerProfile)

export default sellerRoutes
