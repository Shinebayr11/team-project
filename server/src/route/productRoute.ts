import { Hono } from "hono";
import { getMyProducts, getProduct, postProduct } from "../controllers/productController.js";
import { requireAuth } from "../middleware/auth.js";

const productRoute = new Hono()
// "/mine" нь "/" -тэй мөргөлдөхгүй тул дараалал чухал биш ч, тодорхой замыг эхэнд нь.
productRoute.get("/mine", requireAuth, getMyProducts)
productRoute.get("/", getProduct)
productRoute.post("/", requireAuth, postProduct)
export default productRoute
