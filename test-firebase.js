import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

  const adminApp = initializeApp({
    projectId: firebaseConfig.projectId
  });

  console.log("Testing (default) database...");
  try {
    const dbDefault = getFirestore(adminApp);
    const snapDefault = await dbDefault.collection("users").limit(1).get();
    console.log("Success on (default)! Size:", snapDefault.size);
  } catch (e) {
    console.log("Failed on (default):", e.message || e);
  }

  console.log("Testing named database...");
  try {
    const dbNamed = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId);
    const snapNamed = await dbNamed.collection("users").limit(1).get();
    console.log("Success on named! Size:", snapNamed.size);
  } catch (e) {
    console.log("Failed on named:", e.message || e);
  }

} catch (err) {
  console.error("Test execution failed:", err);
}
