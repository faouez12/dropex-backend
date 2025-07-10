const express = require("express");
const router = express.Router();
const qrController = require("../controllers/qrController");
const vehicleController = require("../controllers/vehicleController");
const Vehicle = require("../models/Vehicle");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

// 🚗 Create a new vehicle
router.post("/", vehicleController.createVehicle);

// 🚗 Get all vehicles
router.get("/", vehicleController.getAllVehicles);

// 🚀 Generate PDF report of all vehicles
router.get("/generate-pdf-report", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const doc = new PDFDocument();
    const filename = `Vehicle_Report_${Date.now()}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);
    doc.fontSize(18).text("Dropex Vehicle Report", { align: "center" });
    doc.moveDown();

    vehicles.forEach((vehicle, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. Matricule: ${vehicle.matricule} | Type: ${
            vehicle.type
          } | Branch: ${vehicle.branch} | Fuel: ${vehicle.fuelType} | Status: ${
            vehicle.status
          } | KM Today: ${vehicle.kilometrageToday} | Litres: ${
            vehicle.litresConsumed
          } | L/100KM: ${vehicle.litresPer100km}`
        )
        .moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF report");
  }
});

// 🚀 Generate QR code for a specific vehicle by ID
router.get("/generate-qr/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).send("Vehicle not found");

    const qrData = `Matricule: ${vehicle.matricule}
Type: ${vehicle.type}
Branch: ${vehicle.branch}
Fuel: ${vehicle.fuelType}
Status: ${vehicle.status}
KM Today: ${vehicle.kilometrageToday}
Litres: ${vehicle.litresConsumed}
L/100KM: ${vehicle.litresPer100km}`;

    QRCode.toDataURL(qrData, (err, url) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error generating QR code");
      }
      res.send(`
        <h3>QR Code for Vehicle: ${vehicle.matricule}</h3>
        <img src="${url}" alt="QR Code" />
      `);
    });
  } catch (error) {
    console.error("Error generating QR:", error);
    res.status(500).send("Server error while generating QR code");
  }
});

// 🚀 Generate QR PDF for all vehicles
router.get("/generate-qrs", qrController.generateQRPDF);

// 🚗 Get a specific vehicle by ID
router.get("/:id", vehicleController.getVehicleById);

// 🚗 Update a vehicle by ID
router.put("/:id", vehicleController.updateVehicle);

// 🚗 Delete a vehicle by ID
router.delete("/:id", vehicleController.deleteVehicle);

module.exports = router;
