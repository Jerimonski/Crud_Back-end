const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, u.nombre, c.contenido, c.fecha_publicacion
      FROM comentarios c
      JOIN usuario u ON c.usuario_id = u.id
      ORDER BY c.fecha_publicacion DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

router.post("/", async (req, res) => {
  const { usuario_id, contenido } = req.body;
  try {
    await pool.query(
      "INSERT INTO comentarios (usuario_id, contenido) VALUES ($1, $2)",
      [usuario_id, contenido]
    );
    res.status(201).json({ message: "Comentario guardado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar comentario" });
  }
});

module.exports = router;
