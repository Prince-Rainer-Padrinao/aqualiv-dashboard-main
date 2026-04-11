import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import admin from "npm:firebase-admin@11.11.0";

// Pull the secret safely from the Supabase Vault instead of hardcoding it!
const firebaseSecret = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
const serviceAccount = firebaseSecret ? JSON.parse(firebaseSecret) : null;

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}


// ... the rest of your getStatus function and code stays exactly the same ...


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