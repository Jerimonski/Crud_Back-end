import HorariosService from "./../services/horariosService.js"

class HorariosController {
  async getAvailable(req, res) {
    try {
      const { deporteId } = req.query

      const parsedDeporteId = parseInt(deporteId, 10)
      if (isNaN(parsedDeporteId)) {
        return res
          .status(400)
          .json({ mensaje: "ID de deporte inválido. Debe ser un número." })
      }

      const horariosAgendados =
        await HorariosService.getScheduledHorariosByDeporte(parsedDeporteId)
      res.json(horariosAgendados)
    } catch (error) {
      console.error("Error al obtener horarios agendados por deporte:", error)
      res.status(500).json({
        mensaje: "Error interno del servidor al obtener horarios agendados.",
      })
    }
  }

  // AÑADIDO: Nuevo método para obtener todos los horarios base
  async getAllBase(req, res) {
    try {
      const baseHorarios = await HorariosService.getAllBaseHorarios()
      res.json(baseHorarios)
    } catch (error) {
      console.error("Error al obtener todos los horarios base:", error)
      res
        .status(500)
        .json({
          mensaje: "Error interno del servidor al obtener horarios base.",
        })
    }
  }

  async create(req, res) {
    try {
      const { dia_semana, hora_inicio, hora_fin, disponible } = req.body

      if (
        !dia_semana ||
        !hora_inicio ||
        !hora_fin ||
        typeof disponible !== "boolean"
      ) {
        return res
          .status(400)
          .json({ mensaje: "Faltan campos obligatorios o son inválidos." })
      }
      const nuevoHorario = await HorariosService.create({
        dia_semana,
        hora_inicio,
        hora_fin,
        disponible,
      })

      res.status(201).json(nuevoHorario)
    } catch (error) {
      console.error("Error al crear horario:", error)
      res
        .status(500)
        .json({ mensaje: "Error interno del servidor al crear el horario." })
    }
  }
}

export default new HorariosController()
