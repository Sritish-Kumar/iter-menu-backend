import { Router } from "express";
import { db } from "../firebase.js";
import { authenticateUser } from "../middlewares/authentication.js";

const userRouter = Router();
/*
 Returns the User Profile Data
*/
userRouter.get("/profile", authenticateUser, async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      return res.status(404).json({ error: "User not found" });

    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
 Updates the User Profile Data
*/
userRouter.post("/updateProfile", authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    // console.log(uid);

    const { name, email, hostelType, hostelNumber, passingYear } = req.body;

    // console.log(req.body);
    if (!name || !email || !hostelType || !hostelNumber || !passingYear) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.collection("users").doc(uid).update({
      name,
      email,
      hostelType,
      hostelNumber,
      passingYear,
    });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/*
 Deletes the User Data from db
*/
userRouter.delete("/deleteAccount", authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;

    await db.collection("users").doc(uid).delete();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export { userRouter };
