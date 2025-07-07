class comentarioDto {
  constructor({ usuario_id, deporte_id, contenido, valoracion, fecha }) {
    this.usuario_id = usuario_id
    this.deporte_id = deporte_id
    this.contenido = contenido
    this.valoracion = valoracion
    this.fecha = fecha
  }
}

export default comentarioDto
