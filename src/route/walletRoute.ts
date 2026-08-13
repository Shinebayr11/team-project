import { Hono } from "hono";
import { getWallet, postWallet } from "../controllers/walletController.js";

const WalletRoutes = new Hono()
WalletRoutes.get("/", getWallet)
WalletRoutes.post("/", postWallet)
export default WalletRoutes