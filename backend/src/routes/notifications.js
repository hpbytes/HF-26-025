const express = require("express");
const router = express.Router();
const { getDb } = require("../db/database");
const { walletAuth } = require("../middleware/auth");

// GET /api/notifications/:wallet — patient's notifications
router.get("/:wallet", walletAuth, (req, res, next) => {
  // Ensure requester can only access their own notifications
  if (req.wallet.toLowerCase() !== req.params.wallet.toLowerCase()) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const db = getDb();
    const { filter } = req.query;

    let sql = "SELECT * FROM notifications WHERE patient_wallet = ?";
    const params = [req.params.wallet];

    if (filter === "unread") {
      sql += " AND read = 0";
    } else if (filter === "stock") {
      sql += " AND type IN ('stock_alert', 'low_stock', 'stock_restored')";
    } else if (filter === "refills") {
      sql += " AND type = 'refill_reminder'";
    }

    sql += " ORDER BY created_at DESC";
    const rows = db.prepare(sql).all(...params);

    const unreadCount = db.prepare(
      "SELECT COUNT(*) as c FROM notifications WHERE patient_wallet = ? AND read = 0"
    ).get(req.params.wallet).c;

    res.json({
      count: rows.length,
      unreadCount,
      notifications: rows.map(formatNotification),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/:id/read — mark single notification read
router.post("/:id/read", walletAuth, (req, res, next) => {
  try {
    const db = getDb();
    db.prepare("UPDATE notifications SET read = 1 WHERE id = ? AND patient_wallet = ?")
      .run(req.params.id, req.wallet);
    res.json({ id: Number(req.params.id), read: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/read-all — mark all notifications read
router.post("/read-all", walletAuth, (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare("UPDATE notifications SET read = 1 WHERE patient_wallet = ? AND read = 0")
      .run(req.wallet);
    res.json({ updated: result.changes });
  } catch (err) {
    next(err);
  }
});

function formatNotification(row) {
  const now = new Date();
  const created = new Date(row.created_at);
  const diffMs = now - created;
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timestamp;
  let group;
  if (diffDays === 0) {
    timestamp = diffHrs < 1 ? "Just now" : `${diffHrs} hrs ago`;
    group = "Today";
  } else if (diffDays === 1) {
    timestamp = `Yesterday · ${created.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    group = "Yesterday";
  } else {
    timestamp = `${diffDays} days ago`;
    group = "Earlier";
  }

  return {
    id: String(row.id),
    type: row.type,
    title: row.title,
    description: row.description,
    timestamp,
    group,
    read: Boolean(row.read),
    drug: row.drug,
    drugCode: row.drug_code,
    actionLabel: row.action_label,
    actionTarget: row.action_target,
  };
}

module.exports = router;
