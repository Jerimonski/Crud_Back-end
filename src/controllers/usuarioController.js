const UsuarioService = require("../services/usuarioService");
const UsuarioDto = require("../dtos/usuarioDto");

class UsuarioController {
  async getAll(req, res) {
    const usuarios = await UsuarioService.getAll();
    res.json(usuarios);
  }

  async getById(req, res) {
    const usuario = await UsuarioService.getById(req.params.id);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(usuario);
  }

  async create(req, res) {
    const dto = new UsuarioDto(req.body);
    const nuevo = await UsuarioService.create(dto);
    res.status(201).json(nuevo);
  }

  async update(req, res) {
    const dto = new UsuarioDto(req.body);
    const actualizado = await UsuarioService.update(req.params.id, dto);
    res.json(actualizado);
  }

  async delete(req, res) {
    await UsuarioService.delete(req.params.id);
    res.status(204).send();
  }
}

module.exports = new UsuarioController();
