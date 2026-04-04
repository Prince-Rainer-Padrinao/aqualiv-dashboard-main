import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// We use the official firebase-admin package to handle Google's strict security
import admin from "npm:firebase-admin@11.11.0";

// TODO: PASTE YOUR FIREBASE SERVICE ACCOUNT JSON CONTENTS HERE
const serviceAccount = {
  "type": "service_account",
  "project_id": "aqualiv-3ea76",
  "private_key_id": "e4c8d18cd5eafdd4805b446c3e5b68b7ad34f334",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC/KoLHfeRbuY19\ncYKmrJal61h27oN/6l3cpAUwhwAy4mZym6ELHVnIz6F6aYpcBaiZfQ0q/LdO7GXF\nrycC6av7wgCGigcHy+ycfNKKzNj7vwmWcFnKKi2PSvQ8hM42dwsx/A0xaqbCamHC\ne3O3w3WF+HPXVPOfMKI49lS27UUGbvXapoWeN0a6XB8B+vA4HqRZRnVFo1r9pPEh\nNUZ+snJsZtq7Og0T0D5+/H8WfVtIKlShghlh0VlrLKpi4cQ2tFo8KCAwaIgdKHfH\nF7Z8d2LXWdH+SH1mndg9j6vbXcdY9AxM8pEzdbknesn0d3iXjSEwax5WUW098VqX\nafJQ+7fpAgMBAAECggEAQ7S/P/+nHxOPeNP4paav7pD1sp3UZjwwRUK0cdUGrX8B\nMOtM9P5Ou/BJ7Wyu69u3NLGVNdnu5J2WiBb6dq4jUxYJkJ0XU1wW7+/HtBBMc5Fc\nSHN/Ybphi4RND5gr3x93kBsI4y02Zdo+yJ5nxDiOicYO5T+5z3JuqkUYiPdtQJL0\nQ/M38RvihDXJItGlt3fYhU7tS/np9tfxZ8DL/lXFxBMoYCPzKU03+rXdUtiVpDHU\nbALWIjYsfffCjYF3HqBtZFe+bwy5bWRCO4FR1WvyS6iGWmVmrhlfPsSi537t2L95\nH+TPF9lWqEP6ElebSUReyMt7uz00zt5wAZHtCLGTDwKBgQDpZQVL0cEAulInwqsZ\n97izYucEvz/M8/9o5RJ9OHYkFlkaLEqm/AascMde2ZPgXJGUV6Rw4Dn3gsHt3Qax\nXAYyn20cf0ddkS1s1+2upF0jA0ln/smdEOlHqcPwl1oBI9RJ7hGvl4ft9FqqJDeE\nhC0IlP0fAqOOS7Q39IIQUWPRwwKBgQDRrnC/udX+LZuEdjBqNFv+Qv3xH9VQdE8q\nrdqVAaM+hEb0aHC3WK71vfZN5U9AI1lC5VmeBGAiyCBwcRlUwGc0cnAyL9+OCcwv\nP/e6pNYqMZ086CIjUzTpP8L0ve/Ue41EjCzjTOEQ8jDQHqtvblzvjMCrq1l58RKR\n9/qWPSDo4wKBgQC2R5+LR5Zk6x+ezfqznTUzZNroajV57FZdpgp6oc4jARE1z8G+\nCLdtlecfvO4xHBrWsFxNi9G57PVowGapviVZBApDZ2RlPy0rBLks3FGhNr/t6J+t\ne7e1sHDHRm2U1lbGJpjJep8+yMjGeOKjLFe/jBzkSztRtu5ZhSzPccFz4QKBgQCL\nhwKr8iN94idse6E36uOUTEvjGgW+ZccQZWPgZ5iTTz5QAPeQacjy6ZduujqEOYF6\nTFfYGJ1IR9eeOwRaKzYB5mzWWJjwUYC3qF9Wqb2BkkZJc0bULtg0piM67PEceaLF\njGmKT2ws9JyawO3fVpctKIJFOd5ukIaE73imZMLzdQKBgQCAjW8zsfODgH2oGqxj\nbftAHdifdh3gtVFx9YGDwfkqh3Q4I95SE8d6LGGTavYAZlR+iCYWU2j7WB3f8T8z\ncVar7ISX0JkfOnrToysGGH00HyLCdb4ugTPyDKxJPNaoG1jNY0CdROWPnFXup6no\ninTxlX++zCuqPohZ8OoM77Qv7g==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@aqualiv-3ea76.iam.gserviceaccount.com",
  "client_id": "118435781583510393860",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40aqualiv-3ea76.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};


// Initialize Firebase (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Helper function to determine Color Status (Adjust these numbers to match your actual safe limits!)
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

  // 1. Get the 2 most recent readings
  const { data: readings } = await supabase
    .from('readings')
    .select('salinity, temperature, created_at')
    .order('created_at', { ascending: false })
    .limit(2);

  if (!readings || readings.length < 2) return new Response("Not enough data to compare", { status: 200 });

  const currentReading = readings[0];
  const previousReading = readings[1];

  // 2. Check their colors
  const currentStatus = getStatus(currentReading.salinity, currentReading.temperature);
  const previousStatus = getStatus(previousReading.salinity, previousReading.temperature);

  console.log(`Previous: ${previousStatus} | Current: ${currentStatus}`);

  // 3. THE STATE-CHANGE CHECK: Did the color change?
  if (currentStatus !== previousStatus) {
    console.log("Status changed! Sending push notifications...");

    // Get all users with an FCM Token
    const { data: profiles } = await supabase
      .from('profiles')
      .select('fcm_token')
      .not('fcm_token', 'is', null);

    if (profiles && profiles.length > 0) {
      const tokens = profiles.map((p: any) => p.fcm_token);

      // Create the Push Message
      const payload = {
        notification: {
          title: `Aqualiv Alert: Status is now ${currentStatus}`,
          body: `Salinity: ${currentReading.salinity}ppm | Temp: ${currentReading.temperature}°C`,
        },
        tokens: tokens, // Send to all registered phones at once
      };

      // Send via Firebase
      try {
        const response = await admin.messaging().sendEachForMulticast(payload);
        console.log(response.successCount + ' messages were sent successfully');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  } else {
    console.log("Status is exactly the same. Doing nothing to save battery/annoyance.");
  }

  return new Response("Done", { status: 200 });
});