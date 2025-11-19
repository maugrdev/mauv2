const express = require('express');
const router = express.Router();
const dbConfig = require('./db_config');

router.get('/testimonios', async (req, res) => {
    try {
        const connection = await dbConfig.getConnection();
        const [rows] = await connection.execute('SELECT nombre, puesto, opinion, imagen FROM testimonios');
        
        res.json(rows); 
        
        connection.release();
    } catch (error) {
        console.error('Error al obtener testimonios de la BD:', error);
        
        // Manejo de error mejorado para el cliente
        res.status(500).json({ error: 'Error interno del servidor al obtener testimonios.' });
    }
});

module.exports = router;