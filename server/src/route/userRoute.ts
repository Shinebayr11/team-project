import { Hono } from "hono";
import { getUsers, postUsers } from "../controllers/userController.js";
import { verifyClerkToken } from "../middleware/auth.js";

const userRoutes = new Hono()

userRoutes.get("/", getUsers)
userRoutes.post("/", verifyClerkToken, postUsers)

export default userRoutes
