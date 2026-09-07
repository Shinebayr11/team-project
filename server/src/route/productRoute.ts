import { Hono } from "hono";
import { deleteProduct, getMyProducts, getProduct, getTrendingProducts, patchProduct, postProduct } from "../controllers/productController.js";
import { requireAuth } from "../middleware/auth.js";

const productRoute = new Hono()
// "/mine" нь "/" -тэй мөргөлдөхгүй тул дараалал чухал биш ч, тодорхой замыг эхэнд нь.
productRoute.get("/mine", requireAuth, getMyProducts)
// Нээлттэй: `/:id` төрлийн зам байхгүй тул мөргөлдөхгүй.
productRoute.get("/trending", getTrendingProducts)
productRoute.get("/", getProduct)
productRoute.post("/", requireAuth, postProduct)
productRoute.patch("/:id", requireAuth, patchProduct)
productRoute.delete("/:id", requireAuth, deleteProduct)
export default productRoute
