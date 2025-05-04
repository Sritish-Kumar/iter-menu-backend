// import admin from "firebase-admin";
// import dotenv from "dotenv";
// import { readFileSync } from "fs";
// import path from "path";

// dotenv.config();

// // Load service account key
// const serviceAccountPath = path.resolve("./config/serviceAccountKey.json");
// const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

// export { admin, db };

// ==========================================================
//  without service account for deployement

import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Prevent reinitialization in Vercel serverless environment
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // for loading key from vercel env
    }),
  });
}

const db = admin.firestore();

export { admin, db };
