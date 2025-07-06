import comentariosService from "../services/comentariosService.js"
import comentariosDto from "../dtos/comentariosDto.js"

class comentariosController {
  async getAll(req, res) {
    try {
      const comentarios = await comentariosService.getAll()
      res.json(comentarios)
    } catch (error) {
      console.error("Error al obtener comentarios:", error)
      res.status(500).json({ mensaje: "Error interno del servidor" })
    }
  }

  async create(req, res) {
    try {
      const dto = new comentariosDto(req.body)
      const nuevoComentario = await comentariosService.create(dto)
      res.status(201).json(nuevoComentario)
    } catch (error) {
      console.error("Error al crear comentario:", error)
      res.status(500).json({ mensaje: "Error al guardar comentario" })
    }
  }
  async getByDeporte(req, res) {
    try {
      const { deporte } = req.query
      const comentarios = await comentariosService.getByDeporte(deporte)
      res.json(comentarios)
    } catch (error) {
      console.error("Error al obtener comentarios por deporte:", error)
      res.status(500).json({ mensaje: "Error interno del servidor" })
    }
  }
}

export default new comentariosController()
