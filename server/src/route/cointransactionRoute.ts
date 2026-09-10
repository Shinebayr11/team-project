import { Hono } from "hono";
import { getCointransaction, postCointransaction } from "../controllers/cointransactionController.js";
import { requireAuth } from "../middleware/auth.js";

const CointransactionRoutes = new Hono()
// Зоосны хөдөлгөөн бол санхүүгийн хувийн бүртгэл — нээлттэй зам БАЙХГҮЙ.
CointransactionRoutes.get("/", requireAuth, getCointransaction)
CointransactionRoutes.post("/", requireAuth, postCointransaction)
export default CointransactionRoutes
