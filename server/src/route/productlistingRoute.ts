import { Hono } from "hono";
import {
    closeProductlisting,
    getProductlisting,
    postProductlisting,
} from "../controllers/productlistingsController.js";
import { requireAuth } from "../middleware/auth.js";

const productlistingRoutes = new Hono()
productlistingRoutes.get("/", getProductlisting)
productlistingRoutes.post("/", requireAuth, postProductlisting)
productlistingRoutes.post("/:id/close", requireAuth, closeProductlisting)
export default productlistingRoutes
