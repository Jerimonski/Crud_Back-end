import db from '../database/connection.js';

class UsuarioDao {
  async getAll() {
    const result = await db.query("SELECT * FROM usuario")
    return result.rows
  }

  async getById(id) {
    const result = await db.query("SELECT * FROM usuario WHERE id = $1", [id])
    return result.rows[0]
  }

  async create(usuario) {
    const query = `
      INSERT INTO usuario (nombre, email, contraseña)
      VALUES ($1, $2, $3)
      RETURNING *`
    const values = [usuario.nombre, usuario.email, usuario.contraseña]
    const result = await db.query(query, values)
    return result.rows[0]
  }

  async update(id, usuario) {
    const query = `
      UPDATE usuario
      SET nombre = $1, email = $2, contraseña = $3
      WHERE id = $6 RETURNING *`
    const values = [usuario.nombre, usuario.email, usuario.contraseña, id]
    const result = await db.query(query, values)
    return result.rows[0]
  }

  async delete(id) {
    await db.query("DELETE FROM usuario WHERE id = $1", [id])
  }
}

export default new UsuarioDao();