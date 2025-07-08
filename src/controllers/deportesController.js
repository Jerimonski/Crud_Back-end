import DeportesService from "../services/deportesService.js"
import DeportesDto from "../dtos/deportesDto.js"
import DeportesDao from "../daos/deportesDao.js"

class DeportesController {
  async getAll(req, res) {
    const deportes = await DeportesService.getAll()
    res.json(deportes)
  }

  async getById(req, res) {
    const deporte = await DeportesService.getById(req.params.id)
    if (!deporte)
      return res.status(404).json({ mensaje: "Deporte no encontrado" })
    res.json(deporte)
  }

  async create(req, res) {
    const dto = new DeportesDto(req.body)
    const nuevo = await DeportesService.create(dto)
    res.status(201).json(nuevo)
  }

  async update(req, res) {
    const dto = new DeportesDto(req.body)
    const actualizado = await DeportesService.update(req.params.id, dto)
    res.json(actualizado)
  }

  async delete(req, res) {
    await DeportesService.delete(req.params.id)
    res.status(204).send()
  }
  async getByNombre(req, res) {
    try {
      const { nombre } = req.params
      const deporte = await DeportesDao.getByNombre(nombre)
      if (!deporte) {
        return res.status(404).json({ message: "Deporte no encontrado" })
      }
      res.json(deporte)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Error al obtener el deporte" })
    }
  }
}

export default new DeportesController()
