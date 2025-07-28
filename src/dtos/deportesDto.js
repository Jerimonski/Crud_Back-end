class DeportesDto {
  constructor({ nombre, descripcion, entrenador, valor }) {
    if (!contenido || typeof contenido !== "string") {
      throw new Error("Contenido inválido")
    }
    this.nombre = nombre
    this.descripcion = descripcion
    this.entrenador = entrenador
    this.valor = valor
  }
}

export default DeportesDto
