const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const tripLogRoutes = require("./routes/tripLogRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Test Route ======
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend running perfectly!" });
});

// ====== MongoDB Connection ======
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== API Routes ======
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/triplogs", tripLogRoutes);

// ====== Start Server ======
app.listen(PORT, () =>
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
);
