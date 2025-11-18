const express = require("express");
const router = express.Router();
const dbPromise = require("../db_config");

// GET
router.get("/testimonios", async (req, res) => {
  try {
    const db = await dbPromise;
    const rows = await db.all("SELECT * FROM testimonios ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
router.post("/testimonios", async (req, res) => {
  const { nombre, mensaje, foto, rating } = req.body;

  if (!nombre || !mensaje)
    return res.status(400).json({ error: "Datos incompletos" });

  try {
    const db = await dbPromise;
    const fecha = new Date().toISOString();

    const result = await db.run(
      "INSERT INTO testimonios (nombre, mensaje, fecha, foto, rating) VALUES (?, ?, ?, ?, ?)",
      nombre, mensaje, fecha, foto || "", rating || 5
    );

    res.json({ success: true, id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/testimonios/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    await db.run("DELETE FROM testimonios WHERE id = ?", req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
