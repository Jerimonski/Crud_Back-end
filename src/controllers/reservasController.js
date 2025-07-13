import reservasServices from "../services/reservasServices.js"
import reservasDto from "./../dtos/reservasDto.js"

class ReservasController {
  async create(req, res) {
    try {
      const { usuario_id, deporte_id, horario_id, fecha, estado } = req.body

      const parsedUsuarioId = parseInt(usuario_id, 10)
      const parsedDeporteId = parseInt(deporte_id, 10)
      const parsedHorarioId = parseInt(horario_id, 10)

      if (
        isNaN(parsedUsuarioId) ||
        isNaN(parsedDeporteId) ||
        isNaN(parsedHorarioId)
      ) {
        return res.status(400).json({
          mensaje:
            "IDs de usuario, deporte u horario inválidos. Deben ser números.",
        })
      }
      if (!fecha) {
        return res.status(400).json({ mensaje: "La fecha es requerida." })
      }
      if (!estado) {
        return res
          .status(400)
          .json({ mensaje: "El estado de la reserva es requerido." })
      }

      const dto = new reservasDto({
        usuario_id: parsedUsuarioId,
        deporte_id: parsedDeporteId,
        horario_id: parsedHorarioId,
        fecha,
        estado,
      })

      const nuevaReserva = await reservasServices.create(dto)
      res.status(201).json(nuevaReserva)
    } catch (error) {
      console.error("Error al crear reserva:", error)
      if (error.message.includes("El horario seleccionado ya está reservado")) {
        return res.status(409).jsonn({ mensaje: error.message })
      }
      res
        .status(500)
        .json({ mensaje: "Error interno del servidor al crear la reserva." })
    }
  }

  async getAll(req, res) {
    try {
      const reservas = await reservasServices.getAll()
      res.json(reservas)
    } catch (error) {
      console.error("Error al obtener todas las reservas:", error)
      res.status(500).json({
        mensaje: "Error interno del servidor al obtener las reservas.",
      })
    }
  }

  async delete(req, res) {
    try {
      const reservaId = parseInt(req.params.id, 10)

      if (isNaN(reservaId)) {
        return res
          .status(400)
          .json({ mensaje: "ID de reserva inválido. Debe ser un número." })
      }

      const rowCount = await reservasServices.delete(reservaId)

      if (rowCount === 0) {
        return res
          .status(404)
          .json({ mensaje: "Reserva no encontrada para eliminar." })
      }

      res.status(204).send()
    } catch (error) {
      console.error("Error al eliminar reserva:", error)
      res
        .status(500)
        .json({ mensaje: "Error interno del servidor al eliminar la reserva." })
    }
  }
}

export default new ReservasController()
