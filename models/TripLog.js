const mongoose = require("mongoose");

const tripLogSchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
    matricule: { type: String, required: true },
    vehicleType: { type: String, required: true },
    driverName: { type: String, required: true },
    kmToday: { type: Number, required: true },
    fuelCost: { type: Number, required: true },

    kmDriven: { type: Number }, // Computed
    frais_100km: { type: Number }, // Computed

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-calculate kmDriven and frais_100km before saving
tripLogSchema.pre("save", function (next) {
  this.kmDriven = this.kmToday; // Since no kmYesterday, kmDriven = kmToday

  if (this.kmDriven > 0) {
    this.frais_100km = (this.fuelCost / this.kmDriven) * 100;
  } else {
    this.frais_100km = 0;
  }

  next();
});

const TripLog = mongoose.model("TripLog", tripLogSchema);
module.exports = TripLog;
