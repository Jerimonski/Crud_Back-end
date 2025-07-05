import DeporteService from "../services/deporteService.js";
import DeporteDto from "../dtos/deporteDto.js";

class DeporteController {
  async getAll(req, res) {
    const deportes = await DeporteService.getAll();
    res.json(deportes);
  }

  async getById(req, res) {
    const deporte = await DeporteService.getById(req.params.id);
    if (!deporte)
      return res.status(404).json({ mensaje: "Deporte no encontrado" });
    res.json(deporte);
  }

  async create(req, res) {
    const dto = new DeporteDto(req.body);
    const nuevo = await DeporteService.create(dto);
    res.status(201).json(nuevo);
  }

  async update(req, res) {
    const dto = new DeporteDto(req.body);
    const actualizado = await DeporteService.update(req.params.id, dto);
    res.json(actualizado);
  }

  async delete(req, res) {
    await DeporteService.delete(req.params.id);
    res.status(204).send();
  }
}

export default new DeporteController();
