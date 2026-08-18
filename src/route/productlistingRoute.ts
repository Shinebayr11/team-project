import { Hono } from "hono";
import { getProductlisting, postProductlisting } from "../controllers/productlistings.js";

const productlistingRoutes = new Hono()
productlistingRoutes.get("/", getProductlisting)
productlistingRoutes.post("/", postProductlisting)
export default productlistingRoutes