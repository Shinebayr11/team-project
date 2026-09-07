import { Hono } from "hono";
import {
    closeProductlisting,
    getMyActiveBids,
    getMySales,
    getMyWonListings,
    getProductlisting,
    postProductlisting,
} from "../controllers/productlistingsController.js";
import { requireAuth } from "../middleware/auth.js";

const productlistingRoutes = new Hono()
productlistingRoutes.get("/", getProductlisting)
productlistingRoutes.get("/wins", requireAuth, getMyWonListings)
productlistingRoutes.get("/sales", requireAuth, getMySales)
productlistingRoutes.get("/bidding", requireAuth, getMyActiveBids)
productlistingRoutes.post("/", requireAuth, postProductlisting)
productlistingRoutes.post("/:id/close", requireAuth, closeProductlisting)
export default productlistingRoutes
