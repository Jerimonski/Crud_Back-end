import horariosDao from "../daos/horariosDao.js"

class HorariosService {
  async getAvailableHorarios(deporteId, fecha, diaSemana) {
    return await horariosDao.findAvailableByDeporteAndFecha(
      deporteId,
      fecha,
      diaSemana
    )
  }
}

export default new HorariosService()
