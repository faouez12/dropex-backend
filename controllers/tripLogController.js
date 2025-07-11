const TripLog = require("../models/TripLog");

// Add Trip Log aligned with frontend fields
const addTripLog = async (req, res) => {
  try {
    const { branch, matricule, vehicleType, driverName, kmToday, fuelCost } =
      req.body;

    if (
      !branch ||
      !matricule ||
      !vehicleType ||
      !driverName ||
      !kmToday ||
      !fuelCost
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const tripLog = new TripLog({
      branch,
      matricule,
      vehicleType,
      driverName,
      kmToday,
      fuelCost,
    });

    await tripLog.save();

    res.status(201).json(tripLog);
  } catch (error) {
    console.error("Error adding trip log:", error);
    res.status(500).json({ message: "Server error while adding trip log" });
  }
};

// Fetch all trip logs
const getTripLogs = async (req, res) => {
  try {
    const logs = await TripLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching trip logs:", error);
    res.status(500).json({ message: "Server error while fetching trip logs" });
  }
};

module.exports = { addTripLog, getTripLogs };
