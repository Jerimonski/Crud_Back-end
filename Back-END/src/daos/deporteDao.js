import db from "../database/connection";
import DeporteDto from "./../dtos/deporteDto";

class DeporteDao {
  async getAll() {
    const result = await db.query("SELECT * FROM deportes");
    return result.rows;
  }

  async getById(id) {
    const result = await db.query("SELECT * FROM deportes WHERE ide = $1", [
      id,
    ]);
    return result.rows[0];
  }

  async create(deporte) {
    const query = `
      INSERT INTO deportes (nombre, descripcion, entrenador)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [deporte.nombre, deporte.descripcion, deporte.entrenador];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async update(id, deporte) {
    const query = `
      UPDATE deportes
      SET nombre = $1, descripcion = $2, entrenador = $3
      WHERE id = $4
      RETURNING *`;
    const values = [
      deporte.nombre,
      deporte.descripcion,
      deporte.entrenador,
      id,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    await db.query("DELETE FROM deportes WHERE id = $1", [id]);
  }
}

export default new DeporteDao();
