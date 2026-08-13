import { Hono } from "hono";
import livekit from "./livekit.js";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

const app = new Hono();

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

app.use("/livekit/*", cors({ origin: "http://localhost:3000" }));

app.route("/livekit", livekit);
serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Server: http://localhost:${info.port}`);
});

export default app;
