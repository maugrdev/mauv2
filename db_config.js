const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Ruta a la base
const dbPath = path.join(__dirname, "database", "testimonios.db");

// Si la carpeta no existe, crearla
const folder = path.join(__dirname, "database");
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

// Abrir o crear la base
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al abrir la base SQLite:", err.message);
  } else {
    console.log("Base SQLite lista.");
  }
});

// Crear tabla automáticamente
db.run(`
  CREATE TABLE IF NOT EXISTS testimonios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TEXT NOT NULL
  )
`);

module.exports = db;
