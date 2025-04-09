const usuarioDao = require("../daos/usuarioDao");

class UsuarioService {
  getAll() {
    return usuarioDao.getAll();
  }

  getById(id) {
    return usuarioDao.getById(id);
  }

  create(dto) {
    return usuarioDao.create(dto);
  }

  update(id, dto) {
    return usuarioDao.update(id, dto);
  }

  delete(id) {
    return usuarioDao.delete(id);
  }
}

module.exports = new UsuarioService();
