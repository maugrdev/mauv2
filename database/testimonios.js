const express = require("express");
const router = express.Router();
const db = require("../db_config");

router.get("/testimonios", (req, res) => {
  db.all("SELECT * FROM testimonios ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

router.post("/testimonios", (req, res) => {
  const { nombre, mensaje } = req.body;

  db.run(
    "INSERT INTO testimonios (nombre, mensaje, fecha) VALUES (?, ?, datetime('now'))",
    [nombre, mensaje],
    function (err) {
      if (err) return res.status(500).json({ error: err });
      res.json({ ok: true, id: this.lastID });
    }
  );
});

module.exports = router;
