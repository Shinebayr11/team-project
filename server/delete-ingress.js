import { AccessToken, RoomServiceClient, IngressClient } from 'livekit-server-sdk';

const client = new IngressClient(
  'https://team-project-421j8ams.livekit.cloud',
  'API638LJ5FSXdwy',
  'T9UNySWNenM0ocua4LbaeCYOpJuetP8UsYJXNkR05enA'
);

(async () => {
  try {
    console.log('Listing ingresses...');
    const ingresses = await client.listIngress({ roomName: '' });
    console.log('Found ingresses:', JSON.stringify(ingresses, null, 2));
    
    if (ingresses && ingresses.length > 0) {
      for (const ingress of ingresses) {
        console.log(`Deleting ingress: ${ingress.ingressId}`);
        await client.deleteIngress(ingress.ingressId);
        console.log(`✅ Deleted: ${ingress.ingressId}`);
      }
    } else {
      console.log('No ingresses found');
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
