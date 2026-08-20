// server/src/livekit.ts
import { Hono } from "hono";
import { AccessToken } from "livekit-server-sdk";

const app = new Hono();

app.post("/token", async (c) => {
  const { roomName, identity, name, canPublish } = await c.req.json();

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    // identity өрөөнд давхцахгүй байх ёстой тул санамсаргүй үлдээнэ; name нь
    // чат зэрэгт харагдах хүний нэр.
    { identity, name, ttl: "2h" },
  );

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: !!canPublish, // host=true, үзэгч=false
    canSubscribe: true,
    canPublishData: true, // чат/бид data channel-ээр
  });

  return c.json({ token: await at.toJwt() });
});

export default app;
