import { Live_Show } from "../src/models/Live_show.js";
import mongoose from "mongoose";

async function clearIngress() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("MongoDB холбогдлоо");

    const result = await Live_Show.updateMany(
      {},
      {
        $set: {
          ingressId: null,
          egressId: null,
          liveStatus: "idle",
          roomName: null,
        },
      }
    );

    console.log(`✅ ${result.modifiedCount} записей очищено`);
    process.exit(0);
  } catch (err) {
    console.error("Алдаа:", err);
    process.exit(1);
  }
}

clearIngress();
