const express = require("express");
const router = express.Router();
const db = require("../db");

// GET — obtener testimonios
router.get("/", (req, res) => {
  db.all("SELECT * FROM testimonios ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST — crear testimonio
router.post("/", (req, res) => {
  const { nombre, mensaje, foto, rating } = req.body;

  if (!nombre || !mensaje) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const fecha = new Date().toISOString();

  const sql = `INSERT INTO testimonios (nombre, mensaje, foto, rating, fecha) 
               VALUES (?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [nombre, mensaje, foto || "", rating || 5, fecha],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        success: true,
        id: this.lastID,
      });
    }
  );
});

// DELETE — eliminar testimonio
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM testimonios WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ success: true });
  });
});

module.exports = router;
