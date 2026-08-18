import { Hono } from "hono";
import { getshowproduct, postshowproduct } from "../controllers/showproductController.js";
const showproductRoutes = new Hono()
showproductRoutes.get("/", getshowproduct)
showproductRoutes.post("/", postshowproduct)
export default showproductRoutes
