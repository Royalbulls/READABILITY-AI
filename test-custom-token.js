import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

  const adminApp = initializeApp({
    projectId: firebaseConfig.projectId
  });

  const auth = getAuth(adminApp);
  console.log("Generating custom token for uid 'test-user-123'...");
  const token = await auth.createCustomToken("test-user-123");
  console.log("Success! Custom token generated:", token.substring(0, 30) + "...");
} catch (err) {
  console.error("Test failed:", err);
}
