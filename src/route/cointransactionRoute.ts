import { Hono } from "hono";
import { getCointransaction, postCointransaction } from "../controllers/cointransactionController.js";

const CointransactionRoutes = new Hono()
CointransactionRoutes.get("/", getCointransaction)
CointransactionRoutes.post("/", postCointransaction)
export default CointransactionRoutes