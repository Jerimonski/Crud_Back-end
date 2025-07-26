import db from "../database/connection.js"

class ReporteDao {
  async getReservasPorDeporte() {
    const query = `
      SELECT 
        d.id AS deporte_id,
        d.nombre AS deporte,
        d.entrenador,
        u.nombre AS usuario,
        r.fecha,
        h.hora_inicio,
        h.hora_fin,
        r.estado
        FROM reservas r
      JOIN usuario u ON r.usuario_id = u.id
      JOIN deportes d ON r.deporte_id = d.id
      JOIN horarios h ON r.horario_id = h.id
      ORDER BY d.id, r.fecha;
    `
    const result = await db.query(query)
    return result.rows
  }
}

export default new ReporteDao()
