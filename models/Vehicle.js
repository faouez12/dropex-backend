const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  matricule: { type: String, required: true },
  type: { type: String, required: true },
  branch: { type: String, required: true },
  fuelType: { type: String, enum: ["Essence", "Diesel"], required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

  // 🚗 Tracking & fuel consumption fields
  kilometrageToday: { type: Number, default: 0 },
  litresConsumed: { type: Number, default: 0 },
  litresPer100km: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
