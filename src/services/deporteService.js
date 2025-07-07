import deporteDao from "../daos/deporteDao.js"

class DeporteService {
  getAll() {
    return deporteDao.getAll()
  }

  getById(id) {
    return deporteDao.getById(id)
  }

  create(dto) {
    return deporteDao.create(dto)
  }

  update(id, dto) {
    return deporteDao.update(id, dto)
  }

  delete(id) {
    return deporteDao.delete(id)
  }
}

export default new DeporteService()
