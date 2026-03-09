/**
 * Setup Demo — Run once after Ganache is up and contracts are deployed.
 *
 * 1. Seeds drug catalog, facilities, stock into SQLite
 * 2. Grants patient role to Ganache signers[4]
 * 3. Seeds prescriptions & notifications for the demo patient
 * 4. Updates deployed.json with the patient wallet
 * 5. Outputs the wallet map for frontend config
 */
require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { getDb } = require("../src/db/database");
const { seed: seedDrugs } = require("../src/db/seed");

const DEPLOYED_PATH = path.join(__dirname, "..", "..", "contracts", "deployed.json");
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:7545";

async function main() {
  console.log("\n=== MedChain Demo Setup ===\n");

  // 1. Seed drug catalog
  console.log("[1/5] Seeding drug catalog...");
  seedDrugs();

  // 2. Connect to Ganache and discover accounts
  console.log("[2/5] Connecting to Ganache at", RPC_URL);
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const accounts = await provider.listAccounts();
  console.log(`  Found ${accounts.length} accounts`);

  const adminSigner = accounts[0];
  const patientAddress = accounts[4].address;
  console.log(`  Admin:        ${accounts[0].address}`);
  console.log(`  Manufacturer: ${accounts[1].address}`);
  console.log(`  Distributor1: ${accounts[2].address}`);
  console.log(`  Distributor2: ${accounts[3].address}`);
  console.log(`  Patient:      ${patientAddress}`);

  // 3. Grant patient role
  console.log("[3/5] Granting patient role...");
  const deployed = JSON.parse(fs.readFileSync(DEPLOYED_PATH, "utf8"));
  const abiPath = path.join(__dirname, "..", "..", "contracts", "artifacts", "contracts", "MedAccessControl.sol", "MedAccessControl.json");
  const abi = JSON.parse(fs.readFileSync(abiPath, "utf8")).abi;
  const accessControl = new ethers.Contract(deployed.contracts.MedAccessControl, abi, adminSigner);

  const isAlreadyPatient = await accessControl.isPatient(patientAddress);
  if (isAlreadyPatient) {
    console.log("  Patient role already granted");
  } else {
    const tx = await accessControl.grantPatientRole(patientAddress);
    await tx.wait();
    console.log("  ✓ Patient role granted");
  }

  // 4. Seed prescriptions & notifications for the demo patient
  console.log("[4/5] Seeding prescriptions & notifications...");
  const db = getDb();

  const rxCount = db.prepare("SELECT COUNT(*) as c FROM prescriptions WHERE patient_wallet = ?").get(patientAddress);
  if (rxCount.c === 0) {
    const insertRx = db.prepare(
      `INSERT INTO prescriptions (id, patient_wallet, drug_code, form, dosage, doctor, hospital, prescribed_date, duration, status, refills_total, refills_used, next_refill_date, completed_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const rxData = [
      ["rx1", patientAddress, "METF", "500mg", "Twice daily", "Dr. Rajan Kumar", "City Hospital TN", "15 Jan 2024", "Ongoing", "active", 3, 1, "15 Jul 2024", null],
      ["rx2", patientAddress, "AMLO", "5mg", "Once daily", "Dr. Rajan Kumar", "City Hospital TN", "15 Jan 2024", "Ongoing", "active", 3, 2, "20 Jul 2024", null],
      ["rx3", patientAddress, "INSU", "100IU", "As prescribed", "Dr. Rajan Kumar", "City Hospital TN", "15 Jan 2024", "Ongoing", "active", 6, 3, "10 Jul 2024", null],
      ["rx4", patientAddress, "AMOX", "500mg", "3x daily", "Dr. Meena", "City Hospital TN", "5 Dec 2023", "7 days", "past", 0, 0, null, "Jan 2024"],
      ["rx5", patientAddress, "CIPR", "500mg", "Twice daily", "Dr. Meena", "City Hospital TN", "10 Oct 2023", "10 days", "past", 0, 0, null, "Oct 2023"],
    ];
    db.transaction(() => { for (const r of rxData) insertRx.run(...r); })();
    console.log("  ✓ 5 prescriptions seeded");
  } else {
    console.log("  Prescriptions already seeded");
  }

  const nCount = db.prepare("SELECT COUNT(*) as c FROM notifications WHERE patient_wallet = ?").get(patientAddress);
  if (nCount.c === 0) {
    const insertNotif = db.prepare(
      `INSERT INTO notifications (patient_wallet, type, title, description, drug, drug_code, read, action_label, action_target)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const notifs = [
      [patientAddress, "stock_alert", "Stock Alert", "Insulin is critically low in Chennai. Your prescription needs this medicine.", "Insulin", "INSU", 0, "Find Stock", "find_stock"],
      [patientAddress, "refill_reminder", "Refill Reminder", "Metformin refill due in 5 days — 15 Jul 2024", "Metformin", "METF", 0, "View Prescription", "view_prescription"],
      [patientAddress, "stock_restored", "Stock Restored", "Artemether back in stock at Madurai. Previously low stock.", "Artemether", "ARTE", 1, null, null],
      [patientAddress, "verify_log", "Verification Log", "You verified Paracetamol on blockchain — ✅ Authentic", "Paracetamol", "PARA", 1, null, null],
      [patientAddress, "low_stock", "Low Stock Warning", "Chloroquine stock is running low in Chennai region.", "Chloroquine", "CHLO", 1, "Find Stock", "find_stock"],
      [patientAddress, "refill_reminder", "Refill Reminder", "Amlodipine refill due in 10 days — 20 Jul 2024", "Amlodipine", "AMLO", 1, "View Prescription", "view_prescription"],
    ];
    db.transaction(() => { for (const n of notifs) insertNotif.run(...n); })();
    console.log("  ✓ 6 notifications seeded");
  } else {
    console.log("  Notifications already seeded");
  }

  // 5. Update deployed.json
  console.log("[5/5] Updating deployed.json...");
  deployed.wallets = deployed.wallets || {};
  deployed.wallets.manufacturer = accounts[1].address;
  deployed.wallets.distributor1 = accounts[2].address;
  deployed.wallets.distributor2 = accounts[3].address;
  deployed.wallets.patient = patientAddress;
  fs.writeFileSync(DEPLOYED_PATH, JSON.stringify(deployed, null, 2));
  console.log("  ✓ deployed.json updated");

  console.log("\n=== Setup Complete ===");
  console.log("\nDemo Wallets:");
  console.log(`  Manufacturer: ${deployed.wallets.manufacturer}`);
  console.log(`  Distributor:  ${deployed.wallets.distributor1}`);
  console.log(`  Patient:      ${patientAddress}`);
  console.log("\nStart the backend:  cd backend && node app.js");
  console.log("Start the app:      cd hf-26-025 && npx expo start\n");
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
