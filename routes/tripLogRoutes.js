const express = require("express");
const router = express.Router();
const tripLogController = require("../controllers/tripLogController");

router.post("/", tripLogController.addTripLog);
router.get("/", tripLogController.getTripLogs);

module.exports = router;
