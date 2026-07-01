console.log("PROJECT ENV KEYS:");
for (const key of Object.keys(process.env)) {
  if (key.includes("PROJECT") || key.includes("GCLOUD") || key.includes("GOOGLE") || key.includes("FIREBASE")) {
    console.log(`${key}: ${process.env[key]}`);
  }
}
