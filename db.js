const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbFolder = path.join(__dirname, "database");
const dbPath = path.join(dbFolder, "testimonios.db");

// Crear carpeta si no existe
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder);
}

// Abrir o crear DB
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Error:", err.message);
  else console.log("📦 Base SQLite lista.");
});

// Crear tabla
db.run(`
  CREATE TABLE IF NOT EXISTS testimonios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    foto TEXT DEFAULT '',
    rating INTEGER DEFAULT 5,
    fecha TEXT NOT NULL
  )
`);

module.exports = db;
