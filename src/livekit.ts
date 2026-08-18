import { Context } from "hono";
import { AccessToken } from "livekit-server-sdk";
import { Live_Show } from "./models/Live_show";

export const getLiveKitToken = async (c: Context) => {
  try {
    const user = c.get("user");
    const { roomName } = await c.req.json();

    if (!roomName) {
      return c.json({ message: "roomName шаардлагатай" }, 400);
    }

    const show = await Live_Show.findOne({ livekit_room_name: roomName });
    if (!show) {
      return c.json({ message: "Шоу олдсонгүй" }, 404);
    }

    // A4: Лайвыг үүсгэсэн худалдагч мөн эсэхийг сервер дээр шийднэ
    const isHost = show.seller_id.toString() === user._id.toString();

    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user._id.toString(), // Токеноос олдсон хэрэглэгчийн ID
      ttl: "2h",
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: isHost, // Зөвхөн host зарах/дамжуулах эрхтэй
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();
    return c.json({ token });
  } catch (error) {
    // B5
    console.error("getLiveKitToken error:", error);
    return c.json({ message: "Токен үүсгэхэд алдаа гарлаа" }, 500);
  }
};






// // server/src/livekit.ts
// import { Hono } from "hono";
// import { AccessToken } from "livekit-server-sdk";

// const app = new Hono();

// app.post("/token", async (c) => {
//   const { roomName, identity, canPublish } = await c.req.json();

//   const at = new AccessToken(
//     process.env.LIVEKIT_API_KEY!,
//     process.env.LIVEKIT_API_SECRET!,
//     { identity, ttl: "2h" },
//   );

//   at.addGrant({
//     room: roomName,
//     roomJoin: true,
//     canPublish: !!canPublish, // host=true, үзэгч=false
//     canSubscribe: true,
//     canPublishData: true, // чат/бид data channel-ээр
//   });

//   return c.json({ token: await at.toJwt() });
// });

// export default app;
