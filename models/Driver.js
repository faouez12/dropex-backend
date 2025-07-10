const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

module.exports = mongoose.model("Driver", driverSchema);
