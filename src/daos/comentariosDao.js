import db from "../database/connection.js"

class ComentariosDao {
  async getAll() {
    const result = await db.query(`
      SELECT c.id, u.nombre, c.contenido, c.fecha_publicacion
      FROM comentarios c
      JOIN usuario u ON c.usuario_id = u.id
      ORDER BY c.fecha_publicacion DESC
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
      `INSERT INTO comentarios (usuario_id, contenido)
       VALUES ($1, $2)
       RETURNING *`,
      [comentario.usuario_id, comentario.contenido]
    )
    return result.rows[0]
  }

  async delete(id) {
    await db.query(`DELETE FROM comentarios WHERE id = $1`, [id])
  }
  async findByDeporte(deporte) {
    const sql = "SELECT * FROM comentarios WHERE deporte_id = $1"
    const values = [deporte]
    const result = await db.query(sql, values)
    return result.rows
  }
}
export default new ComentariosDao()
