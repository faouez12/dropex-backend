const TripLog = require("../models/TripLog");
const Vehicle = require("../models/Vehicle");

const addTripLog = async (req, res) => {
  try {
    const { vehicleId, kilometrageToday, litresConsumed } = req.body;

    if (!vehicleId || !kilometrageToday || !litresConsumed) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const litresPer100km = (litresConsumed / kilometrageToday) * 100 || 0;

    const tripLog = new TripLog({
      vehicleId,
      kilometrageToday,
      litresConsumed,
      litresPer100km,
    });

    await tripLog.save();

    // Optionally update the vehicle's current stats
    await Vehicle.findByIdAndUpdate(vehicleId, {
      kilometrageToday,
      litresConsumed,
      litresPer100km,
    });

    res.status(201).json(tripLog);
  } catch (error) {
    console.error("Error adding trip log:", error);
    res.status(500).json({ message: "Server error while adding trip log" });
  }
};

const getTripLogs = async (req, res) => {
  try {
    const logs = await TripLog.find().populate("vehicleId");
    res.json(logs);
  } catch (error) {
    console.error("Error fetching trip logs:", error);
    res.status(500).json({ message: "Server error while fetching trip logs" });
  }
};

module.exports = { addTripLog, getTripLogs };
