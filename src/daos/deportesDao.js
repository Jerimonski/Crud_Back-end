import db from "../database/connection.js"

class DeportesDao {
  async getAll() {
    const result = await db.query("SELECT * FROM deportes")
    return result.rows
  }

  async getById(id) {
    const result = await db.query("SELECT * FROM deportes WHERE id = $1", [id])
    return result.rows[0]
  }

  async create(deporte) {
    const query = `
      INSERT INTO deportes (nombre, descripcion, entrenador, valor) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`
    const values = [
      deporte.nombre,
      deporte.descripcion,
      deporte.entrenador,
      deporte.valor,
    ]
    const result = await db.query(query, values)
    return result.rows[0]
  }

  async update(id, deporte) {
    const query = `
      UPDATE deportes
      SET nombre = $1, descripcion = $2, entrenador = $3, valor = $4
      WHERE id = $5                                              
      RETURNING *`
    const values = [
      deporte.nombre,
      deporte.descripcion,
      deporte.entrenador,
      deporte.valor,
      id,
    ]
    const result = await db.query(query, values)
    return result.rows[0]
  }

  async delete(id) {
    await db.query("DELETE FROM deportes WHERE id = $1", [id])
  }

  async getByNombre(nombre) {
    const result = await db.query(
      "SELECT * FROM deportes WHERE LOWER(nombre) = LOWER($1) LIMIT 1",
      [nombre]
    )
    return result.rows[0]
  }
}

export default new DeportesDao()
