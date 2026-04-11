import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import admin from "npm:firebase-admin@11.11.0";

// 1. FIREBASE SETUP: Replace the details below with your actual Firebase JSON
const serviceAccount = {
  "type": "service_account",
  "project_id": "aqualiv-3ea76",
  "private_key_id": "402cebd153e4eae2eb57f9a89d8a0bf97cd0c7bf",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC+0tk7+jmjeL1F\nkP3432Ua1IrZAM1rStcbQjir/O8QrN0BvgZRlAskfvOeQB5NbozTgtG54ALQHpoD\n6J8ICGz075ZE7K0jVTxgIqc2u+PtW0lAXBEk9IovTyB+cTLiNr8/HYBOh4SYrFyU\nIQzTr5w/8UKcpueQPEnuT7Xtph9vKK4Ib+F4ekjTwkH4vUQg+1XSiCweFOA5FhaB\ngxuPqGYP3E7q29EW2ZtoMyyQlVbUJOVyw0hu2P6g9KQfsKaJU57Gf639yTa1Llx+\njQ5sAocXict5EtqKMQiO1q98XfY66/gJA0q4yUpH+aZxQi/jekOJid9mc85ThiM4\nlkHGI7g/AgMBAAECggEAKudfPlP5R57q90wtPhqEMe8dtMKwbPIrwQ43jbvVyGsF\nWdHuu8LMao08mxURexljAl9EZkVOfJqUyFIyB21VihCgOaj5GJuecoL4E59VFNXU\nd2r709JDi3V/+c3bwe7LOxaX9ZAUqPr/6bIwnxu5xsqozm3cXJqhiLpVTjRuluAr\nOvU6Lz4R3mI9mvFzqEyVAGJ2dV8pv5fkI1zREBJC+4Exv8GOgKLRhhxCOdnwuvOh\nkmWTljES4GcVeIJufLMTIWQVAvq1HeAZ49gxVdSwDUnkkY2Gr+1pggM0sA7cz3Rn\nKk2hinbOc0eaS24TKEMsiEBspecfpbNxZ3dCCGWzOQKBgQD+ShPkNwWvF0Y4c3Eg\n/KgvyDaqB8ct8fPrNszEFoBBUlJQRgwGBHdbrfW6AIYqjOGu3ompfAD+zMdw98w1\nML1ctBOgg7f2dvEt//+1hXoxswXthv1h4WYQzWf4M2f8XPj2xPc/sVY1Edde9IfA\n4y1odD9n6jLTx7/sO9GYVJrNswKBgQDAG3lQPcAfI+hcnYzKl82OyUxeSHNF/hD9\nxMM5u0rfVj/6j9YhT57CJwCmxLuuxfq0PeShKLmlfsTE8dy2KRzNXYq1xhlhT/TO\nqZo8QERM8xEDOL2b3iU7xA+VVRhuICgEtfyVUkEVR4qUksTY+Wod0zy52MoiOvfU\n/Abqh+8dRQKBgBytgAbJycNQTaQKKOT+eX1CCCAu1mCxG8AYIwmuO/Kh9RSGgc6f\n7FITkVXTv03HK6CMClxp1rblo0xzNb197K0qxdfhYvrRuStl5pGzJu+57940zhie\n0eLtN19/dKe6WH2EAxpUxpMfmvljfHfdZv6TtZ7jg63sphFfQaj7SaYPAoGARdW2\n9AR+otNa1NAxLjSg9RcYO+36eacyZg3xKjt7rFSeTWecX9+hxtKG2hkKYS53RK57\nPlqfohnDThTeNxoa7kzi79FjyIxYYgglmWGDcrWpqZIm21KWFnPfdlnI17+4zH2b\npGySXDn1lq0EAhwpB06S9LxqPqdREIvNt9RSiEECgYAxjVirblUuI0kgfh7Hq/ND\nXvVQ1Jk+u1kJT80dXZiNXenawQbz0ow/XpVucBAyDRPWk8HP9xJP054muR7PM4Lm\nLdc0kPvAwIVwP0biUqk2gM9wmT5KaRUYN3amnbH5Mhv00/MKAxvE95db2JnDbqi7\npBy+hIEPJ2LSlRi06FTPUg==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@aqualiv-3ea76.iam.gserviceaccount.com",
  "client_id": "118435781583510393860",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40aqualiv-3ea76.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


// 2. Initialize Firebase securely
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const THIRTY_MINUTES = 30 * 60 * 1000;

function getStatus(salinity: number, temp: number): string {
  if (salinity > 15000 || temp > 32) return "RED";
  if (salinity > 10000 || temp > 30) return "ORANGE";
  return "GREEN";
}

serve(async (req: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  const { data: readings } = await supabase
    .from('readings')
    .select('salinity, temperature, created_at')
    .order('created_at', { ascending: false })
    .limit(2);

  if (!readings || readings.length < 2) return new Response("Not enough data", { status: 200 });

  const currentReading = readings[0];
  const previousReading = readings[1];

  const currentStatus = getStatus(currentReading.salinity, currentReading.temperature);
  const previousStatus = getStatus(previousReading.salinity, previousReading.temperature);

  console.log(`Previous: ${previousStatus} | Current: ${currentStatus}`);

  if (currentStatus !== previousStatus) {
    const now = new Date();

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, phone_number, fcm_token, sms_enabled, last_sms_at');

    if (profiles && profiles.length > 0) {
      
      const eligibleProfiles = profiles.filter(p => {
        if (!p.last_sms_at) return true; 
        const lastSent = new Date(p.last_sms_at);
        return (now.getTime() - lastSent.getTime()) > THIRTY_MINUTES;
      });

      if (eligibleProfiles.length > 0) {
        
        // --- PUSH NOTIFICATIONS ---
        const pushTokens = eligibleProfiles.map(p => p.fcm_token).filter(Boolean);
        
        if (pushTokens.length > 0) {
          const payload = {
            notification: {
              title: `AQUALIV ALERT: ${currentStatus}`,
              body: `Salinity: ${currentReading.salinity}ppm, Temp: ${currentReading.temperature}C`,
            },
            tokens: pushTokens
          };
          try {
            await admin.messaging().sendEachForMulticast(payload);
            console.log("Push Notification Sent!");
          } catch (error) {
            console.error("Push Error:", error);
          }
        }

        // --- SMS BLAST ---
        const smsProfiles = eligibleProfiles.filter(p => p.sms_enabled && p.phone_number);
        const phoneNumbers = smsProfiles.map(p => {
          let num = String(p.phone_number).trim();
          if (num.startsWith('9')) return '+63' + num;
          if (num.startsWith('0')) return '+63' + num.substring(1);
          return num; 
        });

        if (phoneNumbers.length > 0) {
          const unismsSecret = Deno.env.get('UNISMS_SECRET') ?? '';
          const encodedAuth = btoa(`${unismsSecret}:`); 

          try {
            const response = await fetch('https://unismsapi.com/api/blast', {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${encodedAuth}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                content: `AQUALIV: Water is ${currentStatus}. Salinity: ${currentReading.salinity}ppm, Temp: ${currentReading.temperature}C.`,
                recipients: phoneNumbers
              })
            });

            if (response.ok) {
              console.log("SMS Sent!");
            }
          } catch (error) {
            console.error("SMS Fetch Error:", error);
          }
        }

        // --- UPDATE COOLDOWN TIMER ---
        const userIds = eligibleProfiles.map(p => p.id);
        await supabase
          .from('profiles')
          .update({ last_sms_at: now.toISOString() })
          .in('id', userIds);

      } else {
        console.log("Status changed, but 30-minute cooldown is active.");
      }
    }
  } else {
    console.log("Status is exactly the same. Doing nothing.");
  }

  return new Response("Success", { status: 200 });
});