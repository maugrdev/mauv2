const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");
const fs = require("fs");

// Crear carpeta database si no existe
const folder = path.join(__dirname, "database");
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

const dbPath = path.join(folder, "testimonios.db");

async function createDB() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS testimonios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      mensaje TEXT NOT NULL,
      fecha TEXT NOT NULL,
      foto TEXT,
      rating INTEGER
    )
  `);

  return db;
}

module.exports = createDB();
