import { IngressClient } from "livekit-server-sdk";

const apiKey = process.env.LIVEKIT_API_KEY!;
const apiSecret = process.env.LIVEKIT_API_SECRET!;
const liveKitUrl = process.env.LIVEKIT_URL!.replace(/^wss?:\/\//, "").replace(/\/$/, "");

async function deleteAllIngress() {
  try {
    const client = new IngressClient(`https://${liveKitUrl}`, apiKey, apiSecret);
    
    console.log("Listing all ingress...");
    const ingresses = await client.listIngress();
    
    console.log(`Found ${ingresses.length} ingress objects`);
    
    for (const ingress of ingresses) {
      console.log(`Deleting ${ingress.ingressId}...`);
      await client.deleteIngress(ingress.ingressId);
      console.log(`✅ Deleted ${ingress.ingressId}`);
    }
    
    console.log("✅ All ingress deleted!");
    process.exit(0);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

deleteAllIngress();
