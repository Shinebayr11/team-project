import { Hono } from "hono";
import { getWallet, postWallet, topUpWallet } from "../controllers/walletController.js";
import { requireAuth } from "../middleware/auth.js";

const WalletRoutes = new Hono()
WalletRoutes.get("/", requireAuth, getWallet)
WalletRoutes.post("/", requireAuth, postWallet)
WalletRoutes.patch("/topup", requireAuth, topUpWallet)
export default WalletRoutes