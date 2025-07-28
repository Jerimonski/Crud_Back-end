import ReservasDao from "../daos/reservasDao.js"

class ReservasService {
  async create(dto) {
    const isBooked = await ReservasDao.isSlotBooked(
      dto.deporte_id,
      dto.horario_id,
      dto.fecha
    )
    if (isBooked) {
      throw new Error(
        "El horario seleccionado ya está reservado para este deporte y fecha."
      )
    }
    const nuevaReserva = await ReservasDao.create(dto)
    return nuevaReserva
  }

  async getAll() {
    return await ReservasDao.getAllBookings()
  }

  async delete(reservasId) {
    return await ReservasDao.delete(reservasId)
  }

  async updateEstadoReserva(reservaId, estado, motivoFalta) {
    if (!reservaId || isNaN(parseInt(reservaId, 10))) {
      throw new Error("ID de reserva inválido.")
    }
    if (!estado) {
      throw new Error("El estado de la reserva es requerido.")
    }

    const motivoFinal = estado === "Faltó" ? motivoFalta : null

    const reservaActualizada = await ReservasDao.updateEstado(
      reservaId,
      estado,
      motivoFinal
    )
    if (!reservaActualizada) {
      throw new Error("Reserva no encontrada para actualizar estado.")
    }
    return reservaActualizada
  }
}

export default new ReservasService()
