// Ажиллуулах: npx tsx --env-file=.env scripts/deleteOldIngress.ts (server/ дотор)
//
// OBS ingress-ийн хувилбарыг буцаасны (commit ac006e7) дараа LiveKit төсөл дээр
// үлдсэн ingress объектуудыг цэвэрлэнэ. Апп өөрөө одоо ingress үүсгэдэггүй.
import "dotenv/config";
import { IngressClient } from "livekit-server-sdk";

async function deleteAllIngress() {
  // env уншилтыг функц дотор байрлуулсан: модулийн түвшинд `LIVEKIT_URL!` дээр
  // `.replace()` дуудвал env ачаалагдаагүй үед try/catch хүрэхээс өмнө шидэгдэж,
  // "Cannot read properties of undefined" гэсэн ойлгомжгүй мессеж гардаг байв.
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !url) {
    console.error(
      "LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL гурвуулаа тохируулагдсан байх ёстой"
    );
    process.exit(1);
  }

  const host = url.replace(/^wss?:\/\//, "").replace(/\/$/, "");
  const client = new IngressClient(`https://${host}`, apiKey, apiSecret);

  console.log("Ingress жагсааж байна...");
  const ingresses = await client.listIngress();
  console.log(`${ingresses.length} ingress олдлоо`);

  for (const ingress of ingresses) {
    await client.deleteIngress(ingress.ingressId);
    console.log(`✅ Устгав: ${ingress.ingressId}`);
  }

  console.log("✅ Бүх ingress устлаа!");
}

deleteAllIngress().catch((err: any) => {
  console.error("Алдаа:", err?.message ?? err);
  process.exit(1);
});
