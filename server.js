// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const tripLogRoutes = require("./routes/tripLogRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ====== Middleware ======

// ✅ Allow Vercel frontend + Localhost frontend
const allowedOrigins = [
  "https://dropex-frontend.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ====== Test Route ======
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend running perfectly!" });
});

// ====== API Routes ======
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/triplogs", tripLogRoutes);

// ====== MongoDB Connection ======
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () =>
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit on DB connection failure
  }
};

startServer();
