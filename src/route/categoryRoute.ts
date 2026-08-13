import { Hono } from "hono";
import { getcategory, postcategory } from "../controllers/categoryController.js";

const categoryRoutes = new Hono()
categoryRoutes.get("/", getcategory);
categoryRoutes.post("/", postcategory)
export default categoryRoutes
