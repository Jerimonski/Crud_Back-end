import deportesDao from "../daos/deportesDao.js"

class DeportesService {
  getAll() {
    return deportesDao.getAll()
  }

  getById(id) {
    return deportesDao.getById(id)
  }

  create(dto) {
    return deportesDao.create(dto)
  }

  update(id, dto) {
    return deportesDao.update(id, dto)
  }

  delete(id) {
    return deportesDao.delete(id)
  }
}

export default new DeportesService()
