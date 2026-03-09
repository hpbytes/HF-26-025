const express = require("express");
const router = express.Router();
const { getDb } = require("../db/database");
const { walletAuth } = require("../middleware/auth");

// GET /api/prescriptions/:wallet — patient's prescriptions
router.get("/:wallet", walletAuth, (req, res, next) => {
  if (req.wallet.toLowerCase() !== req.params.wallet.toLowerCase()) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const db = getDb();
    const { status } = req.query;

    let sql = `
      SELECT p.*, d.name as drug_name,
        COALESCE((SELECT SUM(fs.quantity) FROM facility_stock fs WHERE fs.drug_code = p.drug_code), 0) as stock_qty
      FROM prescriptions p
      JOIN drugs d ON d.code = p.drug_code
      WHERE p.patient_wallet = ?
    `;
    const params = [req.params.wallet];

    if (status && (status === "active" || status === "past")) {
      sql += " AND p.status = ?";
      params.push(status);
    }

    sql += " ORDER BY p.prescribed_date DESC";
    const rows = db.prepare(sql).all(...params);

    res.json({
      count: rows.length,
      prescriptions: rows.map(formatPrescription),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/prescriptions/:wallet/:id — prescription detail
router.get("/:wallet/:id", walletAuth, (req, res, next) => {
  if (req.wallet.toLowerCase() !== req.params.wallet.toLowerCase()) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const db = getDb();
    const rx = db.prepare(`
      SELECT p.*, d.name as drug_name,
        COALESCE((SELECT SUM(fs.quantity) FROM facility_stock fs WHERE fs.drug_code = p.drug_code), 0) as stock_qty
      FROM prescriptions p
      JOIN drugs d ON d.code = p.drug_code
      WHERE p.id = ? AND p.patient_wallet = ?
    `).get(req.params.id, req.params.wallet);

    if (!rx) return res.status(404).json({ error: "Prescription not found" });

    const facilities = db.prepare(`
      SELECT f.name, f.distance_km
      FROM facilities f
      JOIN facility_stock fs ON fs.facility_id = f.id
      WHERE fs.drug_code = ? AND fs.quantity > 0
      ORDER BY f.distance_km
    `).all(rx.drug_code);

    const formatted = formatPrescription(rx);
    formatted.nearbyFacilities = facilities.map((f) => ({
      name: f.name,
      distanceKm: f.distance_km,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

function getBadge(qty) {
  if (qty === 0) return "unavailable";
  if (qty < 100) return "critical";
  if (qty <= 500) return "low";
  return "in_stock";
}

function formatPrescription(row) {
  return {
    id: row.id,
    drug: row.drug_name,
    drugCode: row.drug_code,
    form: row.form,
    dosage: row.dosage,
    doctor: row.doctor,
    hospital: row.hospital,
    prescribedDate: row.prescribed_date,
    duration: row.duration,
    status: row.status,
    refillsTotal: row.refills_total,
    refillsUsed: row.refills_used,
    nextRefillDate: row.next_refill_date,
    completedDate: row.completed_date,
    stockBadge: getBadge(row.stock_qty),
    stockQty: row.stock_qty,
  };
}

module.exports = router;
