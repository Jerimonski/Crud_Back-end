import express from "express"
const router = express.Router()
import pool from "../database/connection.js"

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, u.nombre, c.contenido, c.valoracion
      FROM comentarios c
      JOIN usuario u ON c.usuario_id = u.id
      ORDER BY c.id DESC
    `)
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener comentarios" })
  }
})

router.post("/", async (req, res) => {
  const { usuario_id, contenido, valoracion } = req.body
  try {
    await pool.query(
      "INSERT INTO comentarios (usuario_id, contenido, valoracion) VALUES ($1, $2, $3)",
      [usuario_id, contenido, valoracion]
    )
    res.status(201).json({ message: "Comentario guardado" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al guardar comentario" })
  }
})

export default router
