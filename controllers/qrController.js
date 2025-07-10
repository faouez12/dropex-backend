// controllers/qrController.js

const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const Vehicle = require("../models/Vehicle");

const generateQRPDF = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    const doc = new PDFDocument({ autoFirstPage: false });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=vehicles_qr.pdf"
    );

    doc.pipe(res);

    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      const qrText = `
Matricule: ${vehicle.matricule}
Type: ${vehicle.type}
Branch: ${vehicle.branch}
Fuel: ${vehicle.fuelType}
Status: ${vehicle.status}
KM Today: ${vehicle.kilometrageToday}
Litres: ${vehicle.litresConsumed}
L/100KM: ${vehicle.litresPer100km}
      `.trim();

      const qrDataUrl = await QRCode.toDataURL(qrText);

      doc.addPage();
      doc
        .fontSize(16)
        .text(`QR Code for: ${vehicle.matricule}`, { align: "center" });
      doc.image(qrDataUrl, { fit: [250, 250], align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(qrText, { align: "center" });
    }

    doc.end();
  } catch (error) {
    console.error("Error generating QR PDF:", error);
    res.status(500).json({ error: "Error generating QR PDF" });
  }
};

module.exports = { generateQRPDF };
