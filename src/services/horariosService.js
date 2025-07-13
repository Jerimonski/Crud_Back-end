import horariosDao from "../daos/horariosDao.js"

class HorariosService {
  async create(horarioDto) {
    return await horariosDao.create(horarioDto)
  }

  async getScheduledHorariosByDeporte(deporteId) {
    return await horariosDao.findScheduledByDeporteId(deporteId)
  }

  async getAllBaseHorarios() {
    return await horariosDao.findAllBaseHorarios()
  }
}

export default new HorariosService()
