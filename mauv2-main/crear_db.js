const Database = require("better-sqlite3");

const db = new Database("./database/mau.db");

// Crear tabla
db.prepare(`
    CREATE TABLE IF NOT EXISTS testimonios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        mensaje TEXT NOT NULL,
        fecha TEXT NOT NULL,
        foto TEXT,
        rating INTEGER DEFAULT 5
    )
`).run();

console.log("Base de datos lista");
router.get("/testimonios", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM testimonios ORDER BY id DESC").all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/testimonios", (req, res) => {
    const { nombre, mensaje, foto, rating } = req.body;

    if (!nombre || !mensaje)
        return res.status(400).json({ error: "Datos incompletos" });

    const fecha = new Date().toISOString();

    try {
        const stmt = db.prepare(
            "INSERT INTO testimonios (nombre, mensaje, fecha, foto, rating) VALUES (?, ?, ?, ?, ?)"
        );

        const result = stmt.run(nombre, mensaje, fecha, foto || "", rating || 5);

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.delete("/testimonios/:id", (req, res) => {
    try {
        db.prepare("DELETE FROM testimonios WHERE id = ?").run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
