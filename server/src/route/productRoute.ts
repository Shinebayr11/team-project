import { Hono } from "hono";
import { getProduct, postProduct } from "../controllers/productController.js";

const productRoute = new Hono()
productRoute.get("/", getProduct)
productRoute.post("/", postProduct)
export default productRoute
