import { Hono } from "hono";
import { getUsers, postUsers } from "../controllers/userController.js";

const userRoutes = new Hono()

userRoutes.get("/", getUsers)
userRoutes.post("/", postUsers)

export default userRoutes
