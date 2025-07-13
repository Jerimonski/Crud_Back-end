import horariosDto from "./../dtos/horariosDto.js"
import horarioService from "./../services/horariosService.js"

class HorariosController {
  async getAvailable(req, res) {
    try {
      const { deporteId, fecha, diaSemana } = req.query
      const parsedDeporteId = parseInt(deporteId, 10)
      if (isNaN(parsedDeporteId)) {
        return res
          .status(400)
          .json({ mensaje: "ID de deporte inválido. Debe ser un número." })
      }
      if (!fecha) {
        return res.status(400).json({ mensaje: "La fecha es requerida" })
      }
      if (!diaSemana) {
        return res
          .status(400)
          .json({ mensaje: "El día de la semana es requerido." })
      }
      const horarios = await horarioService.getAvailableHorarios(
        parsedDeporteId,
        fecha,
        diaSemana
      )
      res.json(horarios)
    } catch (error) {
      console.error("Error al obtener horarios disponibles:", error)
      res
        .status(500)
        .json({ mensaje: "Error interno del servidor al obtener horarios." })
    }
  }
}

export default new HorariosController()
