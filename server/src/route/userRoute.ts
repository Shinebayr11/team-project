import { Hono } from "hono";
import { getCurrentUser, getUsers, postUsers, followUser, unfollowUser, listFollowing, updateAccount, listAddresses, createAddress, updateAddress, deleteAddress } from "../controllers/userController.js";
import { requireAuth, verifyClerkToken } from "../middleware/auth.js";

const userRoutes = new Hono()

userRoutes.get("/", getUsers)
userRoutes.get("/me", requireAuth, getCurrentUser)
userRoutes.patch("/me", requireAuth, updateAccount)
userRoutes.post("/", verifyClerkToken, postUsers)
userRoutes.get("/following", requireAuth, listFollowing)

userRoutes.get("/addresses", requireAuth, listAddresses)
userRoutes.post("/addresses", requireAuth, createAddress)
userRoutes.patch("/addresses/:id", requireAuth, updateAddress)
userRoutes.delete("/addresses/:id", requireAuth, deleteAddress)
userRoutes.post("/follow", requireAuth, followUser)
userRoutes.post("/unfollow", requireAuth, unfollowUser)

export default userRoutes
