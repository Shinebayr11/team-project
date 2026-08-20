import { handle } from "hono/vercel";
import app from "../src/app.js";

export const fetch = handle(app);
