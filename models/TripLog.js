const mongoose = require("mongoose");

const tripLogSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  date: { type: Date, default: Date.now },
  kilometrageToday: { type: Number, required: true },
  litresConsumed: { type: Number, required: true },
  litresPer100km: { type: Number, required: true },
});

module.exports = mongoose.model("TripLog", tripLogSchema);
