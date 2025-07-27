import comentariosDao from "../daos/comentariosDao.js"

class ComentarioService {
  getAll() {
    return comentariosDao.getAll()
  }

  create(dto) {
    return comentariosDao.create(dto)
  }

  async getByDeporte(deporte) {
    return comentariosDao.findByDeporte(deporte)
  }
}

export default new ComentarioService()
