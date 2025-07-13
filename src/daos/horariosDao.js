import db from "../database/connection.js"

class HorariosDao {
  async findAvailableByDeporteAndFecha(deporteId, fecha, diaSemana) {
    const query = `
        SELECT
    h.id AS horario_id,
    h.dia_semana,
    h.hora_inicio,
    h.hora_fin,
    -- La clave para saber si está disponible:
    -- Si r.id es NULL, significa que no hay una reserva coincidente, por lo tanto, el horario está disponible.
    CASE WHEN r.id IS NULL THEN TRUE ELSE FALSE END AS disponible
FROM
    public.horarios h
LEFT JOIN
    public.reservas r ON h.id = r.horario_id
    AND r.deporte_id = $1 -- Filtra las reservas por el deporteId específico
    AND r.fecha = $2     -- Filtra las reservas por la fecha específica
WHERE
    h.dia_semana = $3
    AND h.hora_inicio >= '09:00:00'
    AND h.hora_fin <= '21:00:00'
ORDER BY
    h.hora_inicio ASC;`
    const values = [deporteId, fecha, diaSemana]
    const result = await db.query(query, values)
    return result.row.map((row) => ({
      id: row.horario_id,
      dia_semana: row.dia_semana,
      hora_inicio: row.hora_inicio,
      hora_fin: row.hora_fin,
      disponible: row.disponible,
    }))
  }
}

export default new HorariosDao()
