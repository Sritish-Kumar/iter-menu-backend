import { Router } from "express";
import { db } from "../firebase.js";

const authRouter = Router();

/*
  Checks If user already exist in the db. 
*/
authRouter.post("/check-user", async (req, res) => {
  // console.log("Hit check-user route" + req.body);

  const { uid, name, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(200).json({ isNewUser: false, user: userDoc.data() });
    } else {
      return res.status(200).json({ isNewUser: true });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/*
 Saves User Details in the db.
 Acts as register route
*/
authRouter.post("/signup", async (req, res) => {
  // console.log("Hit signup route"+req.body);

  const { uid, name, email, hostelNumber, hostelType, passingYear } = req.body;

  if (!uid || !name || !email || !hostelNumber) {
    // console.log(req.body);
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.set({ name, email, hostelNumber, hostelType, passingYear });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { authRouter };
