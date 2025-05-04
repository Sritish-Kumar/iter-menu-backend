import { admin, db } from "../firebase.js";

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    // Retrieve user document from Firestore
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const userData = userDoc.data();
    req.user.hostelNumber = userData.hostelNumber; // Attach hostelNumber to req.user

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

export { authenticateUser };
