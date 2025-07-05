import usuarioDao from "../daos/usuarioDao.js"
import jwt from "jsonwebtoken"

class UsuarioService {
  getAll() {
    return usuarioDao.getAll()
  }

  getById(id) {
    return usuarioDao.getById(id)
  }

  create(dto) {
    return usuarioDao.create(dto)
  }

  update(id, dto) {
    return usuarioDao.update(id, dto)
  }

  delete(id) {
    return usuarioDao.delete(id)
  }

  async login(email, password) {
    const usuario = await usuarioDao.findByEmail(email)

    if (!usuario || usuario.contraseña !== password) {
      return null
    }

    const payload = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    return { token, usuario: payload }
  }
}

export default new UsuarioService()
