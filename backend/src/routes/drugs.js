const express = require("express");
const router = express.Router();
const { getDb } = require("../db/database");

// GET /api/drugs — list all drugs with stock aggregation
// Optional query: ?region=Chennai
router.get("/", (req, res, next) => {
  try {
    const db = getDb();
    const { region } = req.query;

    let sql, params;
    if (region) {
      sql = `
        SELECT d.*,
          COALESCE(SUM(fs.quantity), 0) as total_stock,
          COUNT(CASE WHEN fs.quantity > 0 THEN 1 END) as pharmacy_count
        FROM drugs d
        LEFT JOIN facility_stock fs ON fs.drug_code = d.code
        LEFT JOIN facilities f ON f.id = fs.facility_id
        WHERE f.region = ? OR fs.facility_id IS NULL
        GROUP BY d.code
        ORDER BY d.name
      `;
      params = [region];
    } else {
      sql = `
        SELECT d.*,
          COALESCE(SUM(fs.quantity), 0) as total_stock,
          COUNT(CASE WHEN fs.quantity > 0 THEN 1 END) as pharmacy_count
        FROM drugs d
        LEFT JOIN facility_stock fs ON fs.drug_code = d.code
        GROUP BY d.code
        ORDER BY d.name
      `;
      params = [];
    }
    const drugs = db.prepare(sql).all(...params);

    res.json({
      count: drugs.length,
      drugs: drugs.map((d) => ({
        code: d.code,
        name: d.name,
        form: d.form,
        category: d.category,
        price: d.price,
        shelfLifeMonths: d.shelf_life_months,
        manufacturer: d.manufacturer,
        totalStock: d.total_stock,
        badge: getBadge(d.total_stock),
        pharmacyCount: d.pharmacy_count,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/drugs/:code — drug detail with facilities
router.get("/:code", (req, res, next) => {
  try {
    const db = getDb();
    const drug = db.prepare("SELECT * FROM drugs WHERE code = ?").get(req.params.code);
    if (!drug) return res.status(404).json({ error: "Drug not found" });

    const facilities = db.prepare(`
      SELECT f.*, fs.quantity as stock
      FROM facilities f
      JOIN facility_stock fs ON fs.facility_id = f.id
      WHERE fs.drug_code = ? AND fs.quantity > 0
      ORDER BY f.distance_km
    `).all(req.params.code);

    const totalStock = facilities.reduce((sum, f) => sum + f.stock, 0);

    res.json({
      code: drug.code,
      name: drug.name,
      form: drug.form,
      category: drug.category,
      price: drug.price,
      shelfLifeMonths: drug.shelf_life_months,
      manufacturer: drug.manufacturer,
      totalStock,
      badge: getBadge(totalStock),
      pharmacyCount: facilities.length,
      facilities: facilities.map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        stock: f.stock,
        distanceKm: f.distance_km,
        hours: f.hours,
      })),
    });
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

module.exports = router;
