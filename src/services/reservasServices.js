import reservasDao from "../daos/reservasDao.js"

class reservasService {
  async create(dto) {
    const isBooked = await reservasDao.isSlotBooked(
      dto.deporte_id,
      dto.horario_id,
      dto.fecha
    )
    if (isBooked) {
      throw new Error(
        "El horario seleccionado ya está reservado para este deporte y fecha."
      )
    }
    const nuevaReserva = await reservasDao.create(dto)
    return nuevaReserva
  }

  async getAll() {
    return await reservasDao.getAllBookings()
  }

  async delete(reservasId) {
    return await reservasDao.delete(reservasId)
  }

  async updateEstadoReserva(reservaId, estado, motivoFalta) {
    if (!reservaId || isNaN(parseInt(reservaId, 10))) {
      throw new Error("ID de reserva inválido.")
    }
    if (!estado) {
      throw new Error("El estado de la reserva es requerido.")
    }

    const motivoFinal = estado === "Faltó" ? motivoFalta : null

    const reservaActualizada = await reservasDao.updateEstado(
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

export default new reservasService()
