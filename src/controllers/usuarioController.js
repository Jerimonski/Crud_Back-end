import UsuarioService from "../services/usuarioService.js"
import UsuarioDto from "../dtos/usuarioDto.js"

class UsuarioController {
  async getAll(req, res) {
    const usuarios = await UsuarioService.getAll()
    res.json(usuarios)
  }

  async getById(req, res) {
    const usuario = await UsuarioService.getById(req.params.id)
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" })
    res.json(usuario)
  }

  async create(req, res) {
    const dto = new UsuarioDto(req.body)
    const nuevo = await UsuarioService.create(dto)
    res.status(201).json(nuevo)
  }

  async update(req, res) {
    const dto = new UsuarioDto(req.body)
    const actualizado = await UsuarioService.update(req.params.id, dto)
    res.json(actualizado)
  }

  async delete(req, res) {
    await UsuarioService.delete(req.params.id)
    res.status(204).send()
  }

  async login(req, res) {
    const { email, password } = req.body

    try {
      const result = await UsuarioService.login(email, password)

      if (!result) {
        return res.status(401).json({ mensaje: "Credenciales incorrectas" })
      }

      res.status(200).json(result)
    } catch (error) {
      console.error("Error en login:", error)
      res.status(500).json({ mensaje: "Error al intentar iniciar sesión" })
    }
  }
}

export default new UsuarioController()
