import db from "../database/connection.js"

class reservasDao {
  async create(reserva) {
    const query = `
      INSERT INTO public.reservas (usuario_id, deporte_id, horario_id, fecha, estado)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`
    const values = [
      reserva.usuario_id,
      reserva.deporte_id,
      reserva.horario_id,
      reserva.fecha,
      reserva.estado,
    ]
    const result = await db.query(query, values)
    return result.rows[0]
  }

  async isSlotBooked(deporteId, horarioId, fecha) {
    const query = `
      SELECT COUNT(*) AS count
      FROM public.reservas
      WHERE deporte_id = $1 AND horario_id = $2 AND fecha = $3;
    `
    const values = [deporteId, horarioId, fecha]
    const result = await db.query(query, values)
    return parseInt(result.rows[0].count, 10) > 0
  }

  async delete(reservaId) {
    const result = await db.query(
      "DELETE FROM public.reservas WHERE id = $1;",
      [reservaId]
    )
    return result.rowCount
  }

  async getAllBookings() {
    const query = `SELECT
    r.id AS reserva_id,
    u.nombre AS usuario_nombre,
    u.email AS usuario_email, -- Podrías querer el email también
    d.nombre AS deporte_nombre,
    h.hora_inicio,
    h.hora_fin,
    r.fecha,
    r.estado,
    r.created_at -- O cualquier otra columna relevante de la reserva
FROM
    public.reservas r
JOIN
    public.usuario u ON r.usuario_id = u.id
JOIN
    public.deportes d ON r.deporte_id = d.id
JOIN
    public.horarios h ON r.horario_id = h.id
ORDER BY
    r.fecha DESC, h.hora_inicio ASC;`
    const result = await db.query(query)
    return result.rows
  }
}

export default new reservasDao()
