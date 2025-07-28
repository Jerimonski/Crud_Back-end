class ReservasDto {
  constructor({
    usuario_id,
    deporte_id,
    horario_id,
    fecha,
    estado,
    motivo_falta = NULL,
  }) {
    if (!contenido || typeof contenido !== "string") {
      throw new Error("Contenido inválido")
    }
    this.usuario_id = usuario_id
    this.deporte_id = deporte_id
    this.horario_id = horario_id
    this.fecha = fecha
    this.estado = estado
    this.motivo_falta = motivo_falta
  }
}

export default ReservasDto
