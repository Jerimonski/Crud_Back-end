import db from "../database/connection.js"

class ComentariosDao {
  async getAll() {
    const result = await db.query(`
    SELECT c.id, u.nombre, c.contenido, c.fecha, c.deporte_id, c.valoracion
    FROM comentarios c
    JOIN usuario u ON c.usuario_id = u.id
    ORDER BY c.fecha DESC
  `)
    return result.rows
  }

  async getById(id) {
    const result = await db.query(`SELECT * FROM comentarios WHERE id = $1`, [
      id,
    ])
    return result.rows[0]
  }

  async create(comentario) {
    const result = await db.query(
      `INSERT INTO comentarios (usuario_id, deporte_id, contenido, valoracion, fecha)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
      [
        comentario.usuario_id,
        comentario.deporte_id,
        comentario.contenido,
        comentario.valoracion,
        comentario.fecha,
      ]
    )
    return result.rows[0]
  }

  async delete(id) {
    await db.query(`DELETE FROM comentarios WHERE id = $1`, [id])
  }
  async findByDeporte(deporteId) {
    const sql = `
            SELECT c.id, u.nombre, c.contenido, c.fecha,
            c.deporte_id, c.valoracion FROM comentarios c
            JOIN usuario u ON c.usuario_id = u.id
            WHERE c.deporte_id = $1 
            ORDER BY c.fecha DESC; 
        `
    const values = [deporteId]
    const result = await db.query(sql, values)
    return result.rows
  }
}
export default new ComentariosDao()
