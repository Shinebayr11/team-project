import { Hono } from "hono";
import { deleteProduct, getMyProducts, getProduct, getProductById, getTrendingProducts, patchProduct, postProduct } from "../controllers/productController.js";
import { requireAuth } from "../middleware/auth.js";

const productRoute = new Hono()
// "/mine" нь "/" -тэй мөргөлдөхгүй тул дараалал чухал биш ч, тодорхой замыг эхэнд нь.
productRoute.get("/mine", requireAuth, getMyProducts)
productRoute.get("/trending", getTrendingProducts)
productRoute.get("/", getProduct)
// `/:id` нь ХАМГИЙН СҮҮЛД — эс тэгвээс "/mine", "/trending"-ийг залгина.
productRoute.get("/:id", getProductById)
productRoute.post("/", requireAuth, postProduct)
productRoute.patch("/:id", requireAuth, patchProduct)
productRoute.delete("/:id", requireAuth, deleteProduct)
export default productRoute
