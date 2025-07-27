import DeportesService from "../../src/services/deportesService.js"
import DeportesDao from "../../src/daos/deportesDao.js"

jest.mock("../../src/daos/deportesDao.js")

describe("DeportesService - Pruebas Unitarias", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // --- Prueba para getAll ---
  it("debería devolver todos los deportes", async () => {
    const mockDeportes = [
      { id: 1, nombre: "Fútbol", entrenador: "Juan", valor: 50 },
      { id: 2, nombre: "Baloncesto", entrenador: "Maria", valor: 60 },
    ]

    // Simula que DeportesDao.getAll() devuelve nuestros datos mock
    DeportesDao.getAll.mockResolvedValue(mockDeportes)

    const result = await DeportesService.getAll()

    expect(result).toEqual(mockDeportes)
    expect(DeportesDao.getAll).toHaveBeenCalledTimes(1)
    expect(DeportesDao.getAll).toHaveBeenCalledWith()
  })

  // --- Prueba para create ---
  it("debería crear un nuevo deporte", async () => {
    const nuevoDeporteData = {
      nombre: "Tenis",
      descripcion: "Un deporte de raqueta",
      entrenador: "Carlos",
      valor: 75,
    }
    const deporteCreado = { id: 3, ...nuevoDeporteData }

    DeportesDao.create.mockResolvedValue(deporteCreado)

    const result = await DeportesService.create(nuevoDeporteData)

    expect(result).toEqual(deporteCreado)
    expect(DeportesDao.create).toHaveBeenCalledTimes(1)
    expect(DeportesDao.create).toHaveBeenCalledWith(nuevoDeporteData)
  })

  // --- Prueba para getById ---
  it("debería devolver un deporte por su ID", async () => {
    const mockDeporte = {
      id: 1,
      nombre: "Fútbol",
      entrenador: "Juan",
      valor: 50,
    }

    DeportesDao.getById.mockResolvedValue(mockDeporte)

    const result = await DeportesService.getById(1)

    expect(result).toEqual(mockDeporte)
    expect(DeportesDao.getById).toHaveBeenCalledTimes(1)
    expect(DeportesDao.getById).toHaveBeenCalledWith(1)
  })

  it("debería devolver undefined si el deporte no se encuentra por ID", async () => {
    DeportesDao.getById.mockResolvedValue(undefined)

    const result = await DeportesService.getById(999)

    expect(result).toBeUndefined()
    expect(DeportesDao.getById).toHaveBeenCalledTimes(1)
    expect(DeportesDao.getById).toHaveBeenCalledWith(999)
  })

  // --- Prueba para update ---
  it("debería actualizar un deporte existente", async () => {
    const deporteId = 1
    const datosActualizados = {
      nombre: "Fútbol Sala",
      descripcion: "Fútbol en interior",
      entrenador: "Juan Actualizado",
      valor: 55,
    }
    const deporteActualizado = { id: deporteId, ...datosActualizados }

    DeportesDao.update.mockResolvedValue(deporteActualizado)

    const result = await DeportesService.update(deporteId, datosActualizados)

    expect(result).toEqual(deporteActualizado)
    expect(DeportesDao.update).toHaveBeenCalledTimes(1)
    expect(DeportesDao.update).toHaveBeenCalledWith(
      deporteId,
      datosActualizados
    )
  })

  // --- Prueba para delete ---
  it("debería eliminar un deporte", async () => {
    const deporteId = 1

    DeportesDao.delete.mockResolvedValue()

    await DeportesService.delete(deporteId)

    expect(DeportesDao.delete).toHaveBeenCalledTimes(1)
    expect(DeportesDao.delete).toHaveBeenCalledWith(deporteId)
  })

  // --- Prueba para getByNombre ---
  it("debería devolver un deporte por su nombre", async () => {
    const mockDeporte = {
      id: 1,
      nombre: "Fútbol",
      entrenador: "Juan",
      valor: 50,
    }

    DeportesDao.getByNombre.mockResolvedValue(mockDeporte)

    const result = await DeportesService.getByNombre("Fútbol")

    expect(result).toEqual(mockDeporte)
    expect(DeportesDao.getByNombre).toHaveBeenCalledTimes(1)
    expect(DeportesDao.getByNombre).toHaveBeenCalledWith("Fútbol")
  })

  it("debería devolver undefined si el deporte no se encuentra por nombre", async () => {
    DeportesDao.getByNombre.mockResolvedValue(undefined)

    const result = await DeportesService.getByNombre("Deporte Inexistente")

    expect(result).toBeUndefined()
    expect(DeportesDao.getByNombre).toHaveBeenCalledTimes(1)
    expect(DeportesDao.getByNombre).toHaveBeenCalledWith("Deporte Inexistente")
  })
})
