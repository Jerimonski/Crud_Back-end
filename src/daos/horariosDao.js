import db from "../database/connection.js"

class HorariosDao {
  async create(horario) {
    const query = `
            INSERT INTO public.horarios (dia_semana, hora_inicio, hora_fin, disponible)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`
    const values = [
      horario.dia_semana,
      horario.hora_inicio,
      horario.hora_fin,
      horario.disponible,
    ]
    const result = await db.query(query, values)
    return result.rows[0]
  }

  // AÑADIDO: Método para obtener todos los horarios base (tu tabla public.horarios)
  async findAllBaseHorarios() {
    const query = `
            SELECT
                id,
                dia_semana,
                hora_inicio,
                hora_fin
            FROM
                public.horarios
            ORDER BY
                dia_semana, hora_inicio;` // Ordenar para facilitar el procesamiento en el frontend
    const result = await db.query(query)
    return result.rows.map((row) => ({
      id: row.id,
      dia_semana: row.dia_semana,
      hora_inicio: row.hora_inicio,
      hora_fin: row.hora_fin,
      // No incluimos 'disponible' aquí, ya que este es el horario base, no su estado actual
    }))
  }

  async findScheduledByDeporteId(deporteId) {
    const query = `
        SELECT
            h.id AS horario_id,
            h.dia_semana,
            h.hora_inicio,
            h.hora_fin,
            r.fecha AS fecha_reserva,
            r.usuario_id,
            r.estado
            -- FALSE AS disponible -- No necesitas esto si el frontend lo calcula
        FROM
            public.horarios h
        JOIN
            public.reservas r ON h.id = r.horario_id
            AND r.deporte_id = $1
            AND r.estado = 'confirmada'
        ORDER BY
            r.fecha ASC, h.hora_inicio ASC;`
    const values = [deporteId]
    const result = await db.query(query, values)
    return result.rows.map((row) => ({
      id: row.horario_id, // Este es el ID del horario base reservado
      dia_semana: row.dia_semana,
      hora_inicio: row.hora_inicio,
      hora_fin: row.hora_fin,
      fecha_reserva: row.fecha_reserva,
      usuario_id: row.usuario_id,
      estado: row.estado,
    }))
  }
}

export default new HorariosDao()
