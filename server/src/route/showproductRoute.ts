import { Hono } from "hono";
import { deleteshowproduct, getshowproduct, postshowproduct } from "../controllers/showproductController.js";
import { requireAuth } from "../middleware/auth.js";

const showproductRoutes = new Hono()
showproductRoutes.get("/", getshowproduct)
showproductRoutes.post("/", requireAuth, postshowproduct)
showproductRoutes.delete("/:id", requireAuth, deleteshowproduct)
export default showproductRoutes
