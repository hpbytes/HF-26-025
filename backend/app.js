require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const { getDb } = require("./src/db/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || /localhost|127\.0\.0\.1|10\.0\.2\.2/,
}));
app.use(express.json({ limit: "1mb" }));

// Initialize database on startup
getDb();

// Routes — blockchain
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/batches", require("./src/routes/batches"));
app.use("/api/transfers", require("./src/routes/transfers"));
app.use("/api/audit", require("./src/routes/audit"));
app.use("/api/ml", require("./src/routes/ml"));

// Routes — database
app.use("/api/drugs", require("./src/routes/drugs"));
app.use("/api/prescriptions", require("./src/routes/prescriptions"));
app.use("/api/notifications", require("./src/routes/notifications"));

// GET /api/demo-wallets — returns demo wallet addresses from deployed.json
app.get("/api/demo-wallets", (_req, res) => {
  try {
    const deployedPath = path.join(__dirname, "..", "contracts", "deployed.json");
    const data = JSON.parse(fs.readFileSync(deployedPath, "utf8"));
    res.json({
      manufacturer: data.wallets.manufacturer,
      distributor: data.wallets.distributor1,
      patient: data.wallets.patient || null,
    });
  } catch (err) {
    res.status(500).json({ error: "deployed.json not found. Run setup-demo first." });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Error handler
app.use((err, _req, res, _next) => {
  const message = err.reason || err.shortMessage || err.message || "Internal server error";
  const status = err.status || 500;
  console.error("[API Error]", message);
  // Don't leak internal details in production
  const safeMessage = status >= 500 && process.env.NODE_ENV === "production"
    ? "Internal server error"
    : message;
  res.status(status).json({ error: safeMessage });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
