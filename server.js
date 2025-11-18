const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Tu web

// Rutas API
const testimoniosRoutes = require("./routes/testimonios");
app.use("/api/testimonios", testimoniosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Servidor en puerto " + PORT));
