// __test__/unit/comentariosService.test.js

// Importa el servicio REAL que vas a probar
import ComentarioService from "../../src/services/comentariosService.js"

// 1. Mockea el módulo completo de comentariosDao.
// Cuando Jest ve esto, automáticamente reemplaza todas las exportaciones
// (incluida la exportación por defecto) con funciones mockeadas (jest.fn()).
jest.mock("../../src/daos/comentariosDao.js")

// 2. Importa el DAO. Debido a la línea `jest.mock` anterior,
// esta importación ahora resolverá a la versión mockeada del DAO.
import comentariosDao from "../../src/daos/comentariosDao.js"

describe("ComentarioService - Pruebas Unitarias", () => {
  // 3. Obtén una referencia al módulo mockeado con jest.mocked().
  // Esto proporciona una inferencia de tipos correcta y te permite acceder
  // a los métodos mockeados (como .mockResolvedValue).
  const mockedComentariosDao = jest.mocked(comentariosDao)

  beforeEach(() => {
    // Limpia el estado de los mocks antes de cada prueba.
    // Esto resetea los contadores de llamadas y los valores mockeados.
    jest.clearAllMocks()
  })

  // Prueba para el método getAll
  it("debería devolver todos los comentarios", async () => {
    const mockComentarios = [
      { id: 1, contenido: "Excelente deporte!", usuario_id: 1, deporte_id: 1 },
      { id: 2, contenido: "Muy divertido.", usuario_id: 2, deporte_id: 1 },
    ]
    // Configura el mock directamente en el objeto mockeado que obtuvimos.
    // Ahora 'mockedComentariosDao.getAll' es un jest.fn() y puedes usar .mockResolvedValue.
    mockedComentariosDao.getAll.mockResolvedValue(mockComentarios)

    const result = await ComentarioService.getAll()

    // Verificaciones
    expect(result).toEqual(mockComentarios)
    expect(mockedComentariosDao.getAll).toHaveBeenCalledTimes(1)
    expect(mockedComentariosDao.getAll).toHaveBeenCalledWith()
  })

  // Prueba para el método create
  it("debería crear un nuevo comentario", async () => {
    const newComentarioData = {
      usuario_id: 1,
      deporte_id: 2,
      contenido: "Gran experiencia!",
      valoracion: 5,
      fecha: new Date().toISOString(),
    }
    const createdComentario = { id: 3, ...newComentarioData }
    mockedComentariosDao.create.mockResolvedValue(createdComentario)

    const result = await ComentarioService.create(newComentarioData)

    expect(result).toEqual(createdComentario)
    expect(mockedComentariosDao.create).toHaveBeenCalledTimes(1)
    expect(mockedComentariosDao.create).toHaveBeenCalledWith(newComentarioData)
  })

  // Prueba para el método getByDeporte
  it("debería devolver comentarios por ID de deporte", async () => {
    const deporteId = 1
    const mockComentariosDeporte = [
      { id: 1, contenido: "Excelente!", deporte_id: deporteId },
      { id: 2, contenido: "Genial!", deporte_id: deporteId },
    ]
    mockedComentariosDao.findByDeporte.mockResolvedValue(mockComentariosDeporte)

    const result = await ComentarioService.getByDeporte(deporteId)

    expect(result).toEqual(mockComentariosDeporte)
    expect(mockedComentariosDao.findByDeporte).toHaveBeenCalledTimes(1)
    expect(mockedComentariosDao.findByDeporte).toHaveBeenCalledWith(deporteId)
  })

  it("debería devolver un array vacío si no hay comentarios para el deporte", async () => {
    const deporteId = 99
    mockedComentariosDao.findByDeporte.mockResolvedValue([])

    const result = await ComentarioService.getByDeporte(deporteId)

    expect(result).toEqual([])
    expect(mockedComentariosDao.findByDeporte).toHaveBeenCalledTimes(1)
    expect(mockedComentariosDao.findByDeporte).toHaveBeenCalledWith(deporteId)
  })
})
