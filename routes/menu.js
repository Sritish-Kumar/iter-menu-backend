import { Router } from "express";
import { db } from "../firebase.js";
import { authenticateUser } from "../middlewares/authentication.js";
import dotenv from "dotenv";
dotenv.config();

const menuRouter = Router();

// Function to calculate cycle day and week
const calculateCycleInfo = (dateString) => {
  const referenceDate = new Date(process.env.REFERENCE_DATE);
  const givenDate = new Date(dateString);

  const timeDifference = givenDate - referenceDate;
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Ensuring cycle day is always between 1-28
  const cycleDay = (((daysPassed % 28) + 28) % 28) + 1;

  // Ensuring week number is between 1-4
  const weekNumber = Math.ceil(cycleDay / 7);

  return { cycleDay, weekNumber };
};

/* 
Route to get menu based on date, hostel, and season
*/

menuRouter.get("/getMenu", authenticateUser, async (req, res) => {
  try {
    const { date } = req.query;
    const hostel = req.user.hostelNumber;

    const season = process.env.SEASON;
    // console.log(hostel + date + season);

    const missingParams = [];
    if (!date) missingParams.push("date");
    if (!hostel) missingParams.push("hostel");
    if (!season) missingParams.push("season");

    if (missingParams.length > 0) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters", missingParams });
    }

    const { cycleDay, weekNumber } = calculateCycleInfo(date);
    // console.log(`Cycle Day: ${cycleDay}, Week Number: ${weekNumber}`);

    let collectionRef;
    if (season === "summer") {
      if (hostel.startsWith("BH")) {
        collectionRef = db
          .collection("menus")
          .doc("summer")
          .collection("BH-1-12");
      } else if (hostel.startsWith("LH")) {
        collectionRef = db
          .collection("menus")
          .doc("summer")
          .collection("LH-1-4");
      }
    } else if (season === "winter") {
      if (hostel.startsWith("BH")) {
        collectionRef = db
          .collection("menus")
          .doc("winter")
          .collection("BH-1-12");
      } else if (hostel.startsWith("LH")) {
        collectionRef = db
          .collection("menus")
          .doc("winter")
          .collection("LH-1-4");
      }
    }

    if (!collectionRef) {
      return res.status(400).json({ error: "Invalid hostel or season" });
    }

    const menuDocRef = collectionRef.doc(`day-${cycleDay}`);

    const menuSnapshot = await menuDocRef.get();

    if (!menuSnapshot.exists) {
      return res.status(404).json({ error: "Menu not found" });
    }

    const menuData = menuSnapshot.data();

    res.json({ weekNumber, cycleDay, menu: menuData });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { menuRouter };
