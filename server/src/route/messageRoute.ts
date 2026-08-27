import { Hono } from "hono";
import {
    listConversations,
    listMessages,
    markConversationRead,
    openConversation,
    sendMessage,
} from "../controllers/messageController.js";
import { requireAuth } from "../middleware/auth.js";

const messageRoutes = new Hono()

messageRoutes.get("/conversations", requireAuth, listConversations)
messageRoutes.post("/conversations", requireAuth, openConversation)
messageRoutes.get("/conversations/:id", requireAuth, listMessages)
messageRoutes.post("/conversations/:id/messages", requireAuth, sendMessage)
messageRoutes.patch("/conversations/:id/read", requireAuth, markConversationRead)

export default messageRoutes
