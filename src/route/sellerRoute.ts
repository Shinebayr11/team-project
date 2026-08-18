import { Hono } from "hono";
import { getseller, postseller } from "../controllers/seller.js";

const sellerRoutes = new Hono()
sellerRoutes.get("/", getseller)
sellerRoutes.post("/apply", postseller)
export default sellerRoutes
