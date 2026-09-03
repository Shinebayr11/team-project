import { Hono } from "hono";
import { getCurrentUser, getUsers, postUsers, followUser, unfollowUser } from "../controllers/userController.js";
import { requireAuth, verifyClerkToken } from "../middleware/auth.js";

const userRoutes = new Hono()

userRoutes.get("/", getUsers)
userRoutes.get("/me", requireAuth, getCurrentUser)
userRoutes.post("/", verifyClerkToken, postUsers)
userRoutes.post("/follow", requireAuth, followUser)
userRoutes.post("/unfollow", requireAuth, unfollowUser)

export default userRoutes
