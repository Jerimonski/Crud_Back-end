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
}

export default new reservasService()
