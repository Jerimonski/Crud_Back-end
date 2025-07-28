class ComentarioDto {
  constructor({ usuario_id, deporte_id, contenido, valoracion, fecha }) {
    if (!contenido || typeof contenido !== "string") {
      throw new Error("Contenido inválido")
    }
    this.usuario_id = usuario_id
    this.deporte_id = deporte_id
    this.contenido = contenido
    this.valoracion = valoracion
    this.fecha = fecha
  }
}

export default ComentarioDto
