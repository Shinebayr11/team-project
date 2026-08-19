import { Hono } from "hono";

import { requireAuth } from "../middleware/auth.js";
import { applySeller, getSeller } from "../controllers/seller.js";


const sellerRoutes = new Hono();

// Хүн бүр харах боломжтой GET хүсэлт
sellerRoutes.get("/", getSeller);

// Зөвхөн нэвтэрсэн хэрэглэгч борлуулагч болох хүсэлт илгээх POST хүсэлт
sellerRoutes.post("/apply", requireAuth, applySeller);

export default sellerRoutes;


// import { Hono } from "hono";





// const sellerRoutes = new Hono()
// sellerRoutes.get("/", getseller)
// sellerRoutes.post("/apply", postseller)
// export default sellerRoutes
