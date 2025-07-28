class HorariosDto {
  constructor({ dia_semana, hora_inicio, hora_fin, disponible }) {
    if (!contenido || typeof contenido !== "string") {
      throw new Error("Contenido inválido")
    }
    this.dia_semana = dia_semana
    this.hora_inicio = hora_inicio
    this.hora_fin = hora_fin
    this.disponible = disponible
  }
}

export default HorariosDto
