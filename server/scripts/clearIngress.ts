// Ажиллуулах: npx tsx --env-file=.env scripts/clearIngress.ts (server/ дотор)
//
// OBS ingress-ийн хувилбарыг буцаасны (commit ac006e7) дараа `Live_Show`
// схемээс `ingressId`, `egressId`, `liveStatus`, `roomName` талбарууд хасагдсан.
// Гэвч тэр үед бичигдсэн баримтуудад тэдгээр нь Mongo дотор хэвээр үлдсэн байж
// болно — энэ script тэдгээрийг устгана.
//
// Анхаар: схемд байхгүй талбарт `strict: false` шаардлагатай. Өмнө нь энэ script
// `$set`-ээр эдгээр талбарыг бичихийг оролддог байсан ч strict горим тэдгээрийг
// шууд хаядаг тул юу ч хийхгүй мөртлөө "амжилттай" гэж хэвлэдэг байв.
import mongoose from "mongoose";
import { connectDb } from "../src/lib/db.js";
import { Live_Show } from "../src/models/Live_show.js";

const LEGACY_FIELDS = ["ingressId", "egressId", "liveStatus", "roomName"] as const;

async function clearIngress() {
  await connectDb();
  console.log("MongoDB холбогдлоо");

  const unset = Object.fromEntries(LEGACY_FIELDS.map((field) => [field, ""]));

  const result = await Live_Show.updateMany(
    { $or: LEGACY_FIELDS.map((field) => ({ [field]: { $exists: true } })) },
    { $unset: unset },
    { strict: false }
  );

  console.log(`✅ ${result.modifiedCount} баримтаас хуучин ingress талбаруудыг устгалаа`);
  await mongoose.disconnect();
}

clearIngress().catch((err) => {
  console.error("Алдаа:", err);
  process.exit(1);
});
