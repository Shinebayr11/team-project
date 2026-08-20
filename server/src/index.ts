import { serve } from "@hono/node-server";
import app from "./app.js";

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Сервер http://localhost:${info.port}`);
  }
);
