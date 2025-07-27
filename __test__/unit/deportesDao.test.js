// __test__/unit/deportesDao.test.js

import DeportesDao from "../../src/daos/deportesDao.js"
import db from "../../src/database/connection.js" // Importa tu conexión a la DB

// Mockear el módulo de conexión a la base de datos
jest.mock("../../src/database/connection.js")

describe("DeportesDao - Pruebas Unitarias", () => {
  beforeEach(() => {
    jest.clearAllMocks() // Limpia los mocks antes de cada prueba
  })

  // Prueba para getAll
  it("debería obtener todos los deportes de la base de datos", async () => {
    const mockRows = [
      { id: 1, nombre: "Tenis" },
      { id: 2, nombre: "Squash" },
    ]
    // Simula que db.query devuelve estas filas
    db.query.mockResolvedValue({ rows: mockRows })

    const result = await DeportesDao.getAll()

    expect(result).toEqual(mockRows)
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM deportes")
  })

  // Prueba para create
  it("debería crear un nuevo deporte en la base de datos", async () => {
    const newSportData = {
      nombre: "Golf",
      descripcion: "Palos",
      entrenador: "Tiger",
      valor: 200,
    }
    const createdSport = { id: 3, ...newSportData }
    db.query.mockResolvedValue({ rows: [createdSport] })

    const result = await DeportesDao.create(newSportData)

    expect(result).toEqual(createdSport)
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      `
      INSERT INTO deportes (nombre, descripcion, entrenador, valor) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`,
      [
        newSportData.nombre,
        newSportData.descripcion,
        newSportData.entrenador,
        newSportData.valor,
      ]
    )
  })
})
