const express = require("express");
const TripLog = require("../models/TripLog");
const router = express.Router();

// Create a new trip log
router.post("/", async (req, res) => {
  try {
    const tripLog = new TripLog(req.body);
    await tripLog.save();
    res.status(201).json(tripLog);
  } catch (error) {
    console.error("Error creating trip log:", error);
    res.status(500).json({ message: "Error creating trip log", error });
  }
});

// Get all trip logs with optional filtering
router.get("/", async (req, res) => {
  try {
    const { branch, driverName, startDate, endDate } = req.query;

    const filter = {};
    if (branch) filter.branch = branch;
    if (driverName) filter.driverName = driverName;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const tripLogs = await TripLog.find(filter).sort({ date: -1 });
    res.json(tripLogs);
  } catch (error) {
    console.error("Error fetching trip logs:", error);
    res.status(500).json({ message: "Error fetching trip logs", error });
  }
});

// Update a trip log
router.put("/:id", async (req, res) => {
  try {
    const tripLog = await TripLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(tripLog);
  } catch (error) {
    console.error("Error updating trip log:", error);
    res.status(500).json({ message: "Error updating trip log", error });
  }
});

// Delete a trip log
router.delete("/:id", async (req, res) => {
  try {
    await TripLog.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip log deleted" });
  } catch (error) {
    console.error("Error deleting trip log:", error);
    res.status(500).json({ message: "Error deleting trip log", error });
  }
});

module.exports = router;
