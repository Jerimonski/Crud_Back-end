import db from "../database/connection.js"

class ReporteDao {
  async getReservasPorDeporte() {
    const query = `
      SELECT
        d.id AS deporte_id,
        d.nombre AS deporte_nombre,
        d.entrenador,
        d.descripcion AS deporte_descripcion, 
        d.fecha_creacion AS deporte_fecha_creacion, 
        u.nombre AS usuario_nombre,
        u.email AS usuario_email,   
        u.rol AS usuario_rol,    
        r.fecha AS reserva_fecha,  
        h.dia_semana,             
        h.hora_inicio,
        h.hora_fin,
        r.estado,
        r.motivo_falta              
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
