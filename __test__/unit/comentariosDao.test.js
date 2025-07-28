// __test__/unit/comentariosDao.test.js

import ComentariosDao from "../../src/daos/comentariosDao.js"
import db from "../../src/database/connection.js"

// Mock del módulo de conexión a la base de datos
jest.mock("../../src/database/connection.js", () => ({
  query: jest.fn(), // Mockea el método 'query'
}))

describe("ComentariosDao - Pruebas Unitarias", () => {
  beforeEach(() => {
    // Limpia el estado de los mocks antes de cada prueba para asegurar independencia
    jest.clearAllMocks()
  })

  // Prueba para el método getAll
  it("debería obtener todos los comentarios con información de usuario", async () => {
    const mockRows = [
      {
        id: 1,
        nombre: "UserA",
        contenido: "Comentario 1",
        fecha: "2023-01-01",
        deporte_id: 1,
        valoracion: 5,
      },
      {
        id: 2,
        nombre: "UserB",
        contenido: "Comentario 2",
        fecha: "2023-01-02",
        deporte_id: 2,
        valoracion: 4,
      },
    ]
    // Configura el mock para que db.query resuelva con los datos esperados
    db.query.mockResolvedValue({ rows: mockRows })

    const result = await ComentariosDao.getAll()

    // Verificaciones
    expect(result).toEqual(mockRows)
    expect(db.query).toHaveBeenCalledTimes(1)
    // La cadena SQL debe coincidir EXACTAMENTE con la del DAO, incluyendo espacios y saltos de línea
    expect(db.query).toHaveBeenCalledWith(
      `
      SELECT c.id, u.nombre, c.contenido, c.fecha, c.deporte_id, c.valoracion
      FROM comentarios c
      JOIN usuario u ON c.usuario_id = u.id
      ORDER BY c.fecha DESC
    `
    )
  })

  // Prueba para el método getById
  it("debería obtener un comentario por su ID", async () => {
    const comentarioId = 1
    const mockComentario = {
      id: comentarioId,
      contenido: "Test",
      usuario_id: 1,
    }
    db.query.mockResolvedValue({ rows: [mockComentario] })

    const result = await ComentariosDao.getById(comentarioId)

    expect(result).toEqual(mockComentario)
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM comentarios WHERE id = $1",
      [comentarioId]
    )
  })

  it("debería devolver undefined si el comentario no se encuentra por ID", async () => {
    db.query.mockResolvedValue({ rows: [] }) // Simula que no se encontraron filas

    const result = await ComentariosDao.getById(999)

    expect(result).toBeUndefined() // Espera que el resultado sea undefined
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM comentarios WHERE id = $1",
      [999]
    )
  })

  // Prueba para el método create
  it("debería crear un nuevo comentario en la base de datos", async () => {
    const newComentarioData = {
      usuario_id: 1,
      deporte_id: 1,
      contenido: "Nuevo comentario",
      valoracion: 4,
      fecha: "2023-07-27T10:00:00.000Z",
    }
    const createdComentario = { id: 3, ...newComentarioData }
    db.query.mockResolvedValue({ rows: [createdComentario] })

    const result = await ComentariosDao.create(newComentarioData)

    expect(result).toEqual(createdComentario)
    expect(db.query).toHaveBeenCalledTimes(1)
    // La cadena SQL debe coincidir EXACTAMENTE con la del DAO, incluyendo espacios y saltos de línea
    expect(db.query).toHaveBeenCalledWith(
      `
      INSERT INTO comentarios (usuario_id, deporte_id, contenido, valoracion, fecha)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        newComentarioData.usuario_id,
        newComentarioData.deporte_id,
        newComentarioData.contenido,
        newComentarioData.valoracion,
        newComentarioData.fecha,
      ]
    )
  })

  // Prueba para el método delete
  it("debería eliminar un comentario de la base de datos", async () => {
    const comentarioId = 1
    db.query.mockResolvedValue({}) // No necesitamos un valor de retorno específico para DELETE

    await ComentariosDao.delete(comentarioId)

    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      "DELETE FROM comentarios WHERE id = $1",
      [comentarioId]
    )
  })

  // Prueba para el método findByDeporte
  it("debería encontrar comentarios por ID de deporte", async () => {
    const deporteId = 1
    const mockComentarios = [
      { id: 1, contenido: "Comentario de Deporte 1", deporte_id: deporteId },
    ]
    db.query.mockResolvedValue({ rows: mockComentarios })

    const result = await ComentariosDao.findByDeporte(deporteId)

    expect(result).toEqual(mockComentarios)
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      `
    SELECT c.id, u.nombre, c.contenido, c.fecha,
    c.deporte_id, c.valoracion FROM comentarios c
    JOIN usuario u ON c.usuario_id = u.id
    WHERE c.deporte_id = $1
    ORDER BY c.fecha DESC;
    `,
      [deporteId]
    )
  })

  it("debería devolver un array vacío si no hay comentarios para el deporte", async () => {
    const deporteId = 99
    db.query.mockResolvedValue({ rows: [] }) // Simula que no hay comentarios para este deporte

    const result = await ComentariosDao.findByDeporte(deporteId)

    expect(result).toEqual([])
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      `
    SELECT c.id, u.nombre, c.contenido, c.fecha,
    c.deporte_id, c.valoracion FROM comentarios c
    JOIN usuario u ON c.usuario_id = u.id
    WHERE c.deporte_id = $1
    ORDER BY c.fecha DESC;
    `,
      [deporteId]
    )
  })
})
