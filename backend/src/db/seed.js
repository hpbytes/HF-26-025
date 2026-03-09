const { getDb } = require("./database");

function seed() {
  const db = getDb();

  // Check if already seeded
  const count = db.prepare("SELECT COUNT(*) as c FROM drugs").get();
  if (count.c > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  console.log("Seeding database...");

  // ── Drug Catalog ─────────────────────────────────────
  const insertDrug = db.prepare(
    "INSERT INTO drugs (code, name, form, category, price, shelf_life_months, manufacturer) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  const drugs = [
    ["PARA", "Paracetamol", "500mg tablet", "Analgesic", 2, 36, "MedCorp TN"],
    ["METF", "Metformin", "500mg tablet", "Antidiabetic", 5, 24, "PharmaCorp"],
    ["AMOX", "Amoxicillin", "500mg capsule", "Antibiotic", 8, 24, "MediGen Labs"],
    ["AMLO", "Amlodipine", "5mg tablet", "Antihypertensive", 4, 36, "PharmaCorp"],
    ["ARTE", "Artemether", "20mg tablet", "Antimalarial", 45, 18, "MediGen Labs"],
    ["CHLO", "Chloroquine", "250mg tablet", "Antimalarial", 12, 24, "BioPharm India"],
    ["INSU", "Insulin", "100IU/ml vial", "Antidiabetic", 180, 12, "BioPharm India"],
    ["IBUP", "Ibuprofen", "400mg tablet", "Analgesic", 3, 36, "MedCorp TN"],
    ["OMEP", "Omeprazole", "20mg capsule", "Antacid", 6, 24, "PharmaCorp"],
    ["CIPR", "Ciprofloxacin", "500mg tablet", "Antibiotic", 10, 24, "MediGen Labs"],
    ["SALB", "Salbutamol", "100mcg inhaler", "Bronchodilator", 95, 24, "BioPharm India"],
    ["ONDA", "Ondansetron", "4mg tablet", "Antiemetic", 15, 24, "PharmaCorp"],
  ];

  const insertDrugs = db.transaction(() => {
    for (const d of drugs) insertDrug.run(...d);
  });
  insertDrugs();

  // ── Facilities ───────────────────────────────────────
  const insertFacility = db.prepare(
    "INSERT INTO facilities (id, name, type, region, distance_km, hours) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const facilities = [
    ["f1", "Govt Hospital Chennai", "hospital", "Chennai", 1.2, "24 hours"],
    ["f2", "MedPlus Pharmacy", "pharmacy", "Chennai", 0.4, "8AM – 10PM"],
    ["f3", "Apollo Pharmacy", "pharmacy", "Chennai", 2.1, "9AM – 9PM"],
    ["f4", "City Clinic", "clinic", "Chennai", 3.5, "9AM – 6PM"],
    ["f5", "MedPlus Anna Nagar", "pharmacy", "Chennai", 0.4, "8AM – 10PM"],
    ["f6", "Tropical Med Centre", "clinic", "Madurai", 4.2, "9AM – 5PM"],
    ["f7", "Coimbatore General", "hospital", "Coimbatore", 1.8, "24 hours"],
    ["f8", "MedPlus Coimbatore", "pharmacy", "Coimbatore", 0.6, "8AM – 10PM"],
  ];

  const insertFacilities = db.transaction(() => {
    for (const f of facilities) insertFacility.run(...f);
  });
  insertFacilities();

  // ── Facility Stock ───────────────────────────────────
  const insertStock = db.prepare(
    "INSERT INTO facility_stock (facility_id, drug_code, quantity) VALUES (?, ?, ?)"
  );

  const stock = [
    // Paracetamol — widely available
    ["f1", "PARA", 2000], ["f2", "PARA", 800], ["f3", "PARA", 600], ["f4", "PARA", 800],
    // Metformin
    ["f1", "METF", 1200], ["f5", "METF", 2000],
    // Amoxicillin
    ["f1", "AMOX", 800], ["f2", "AMOX", 500], ["f3", "AMOX", 500],
    // Amlodipine
    ["f1", "AMLO", 500], ["f3", "AMLO", 450],
    // Artemether — low stock
    ["f6", "ARTE", 180],
    // Chloroquine — low stock
    ["f1", "CHLO", 150],
    // Insulin — critical
    ["f1", "INSU", 42],
    // Ibuprofen
    ["f1", "IBUP", 1200], ["f2", "IBUP", 800], ["f3", "IBUP", 800],
    // Omeprazole
    ["f1", "OMEP", 700], ["f5", "OMEP", 700],
    // Ciprofloxacin
    ["f1", "CIPR", 300], ["f3", "CIPR", 300],
    // Salbutamol — low
    ["f1", "SALB", 320],
    // Ondansetron — unavailable (no stock entries)
  ];

  const insertStocks = db.transaction(() => {
    for (const s of stock) insertStock.run(...s);
  });
  insertStocks();

  console.log("  ✓ Drugs, facilities, stock seeded");

  // Patient wallet will be set by setup-demo script
  console.log("  ✓ Database seed complete");
  console.log("  Run 'node scripts/setup-demo.js' to seed prescriptions & notifications for demo patient wallet");
}

module.exports = { seed };

// Allow direct execution
if (require.main === module) {
  seed();
  console.log("Done.");
}
