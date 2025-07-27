import UsuarioDao from "../../src/daos/usuarioDao.js"
import db from "../../src/database/connection.js"

jest.mock("../../src/database/connection.js", () => ({
  query: jest.fn(), // Mockea el método 'query' del objeto 'db'
}))

describe("UsuarioDao - Pruebas Unitarias", () => {
  // Antes de cada prueba, limpia el estado de los mocks
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Prueba para el método getAll
  it("debería obtener todos los usuarios de la base de datos", async () => {
    const mockRows = [
      { id: 1, nombre: "Usuario1", email: "user1@example.com" },
      { id: 2, nombre: "Usuario2", email: "user2@example.com" },
    ]
    // Configura el mock de db.query para que devuelva las filas esperadas
    db.query.mockResolvedValue({ rows: mockRows })

    const result = await UsuarioDao.getAll()

    // Verifica que el resultado sea el esperado
    expect(result).toEqual(mockRows)
    // Verifica que db.query fue llamado una vez
    expect(db.query).toHaveBeenCalledTimes(1)
    // Verifica que db.query fue llamado con la consulta SQL correcta
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM usuario")
  })

  // Prueba para el método getById
  it("debería obtener un usuario por su ID de la base de datos", async () => {
    const userId = 1
    const mockUser = {
      id: userId,
      nombre: "UsuarioTest",
      email: "test@example.com",
    }
    db.query.mockResolvedValue({ rows: [mockUser] })

    const result = await UsuarioDao.getById(userId)

    expect(result).toEqual(mockUser)
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM usuario WHERE id = $1",
      [userId]
    )
  })

  it("debería devolver undefined si el usuario no se encuentra por ID", async () => {
    db.query.mockResolvedValue({ rows: [] }) // Simula que no se encontraron filas

    const result = await UsuarioDao.getById(999) // ID que no existe

    expect(result).toBeUndefined() // O toBeNull() si tu DAO devuelve null explícitamente
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM usuario WHERE id = $1",
      [999]
    )
  })

  // Prueba para el método create
  it("debería crear un nuevo usuario en la base de datos", async () => {
    const newUserData = {
      nombre: "NuevoUsuario",
      email: "nuevo@example.com",
      contraseña: "password123",
    }
    const createdUser = { id: 3, ...newUserData }
    db.query.mockResolvedValue({ rows: [createdUser] })

    const result = await UsuarioDao.create(newUserData)

    expect(result).toEqual(createdUser)
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      // ¡ATENCIÓN AQUÍ! La primera línea de la consulta SQL comienza justo después del backtick.
      // Las líneas subsiguientes tienen 6 espacios de indentación para coincidir con tu DAO.
      `INSERT INTO usuario (nombre, email, contraseña)
      VALUES ($1, $2, $3)
      RETURNING *`, // <--- Asegúrate de que esta indentación sea EXACTA (6 espacios)
      [newUserData.nombre, newUserData.email, newUserData.contraseña]
    )
  })

  // Prueba para el método update
  it("debería actualizar un usuario existente en la base de datos", async () => {
    const userId = 1
    const updateData = {
      nombre: "UsuarioActualizado",
      email: "updated@example.com",
      contraseña: "newpassword",
    }
    const updatedUser = { id: userId, ...updateData }
    db.query.mockResolvedValue({ rows: [updatedUser] })

    const result = await UsuarioDao.update(userId, updateData)

    expect(result).toEqual(updatedUser)
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      // ¡ATENCIÓN AQUÍ! La primera línea de la consulta SQL comienza justo después del backtick.
      // Las líneas subsiguientes tienen 6 espacios de indentación para coincidir con tu DAO.
      `UPDATE usuario
      SET nombre = $1, email = $2, contraseña = $3
      WHERE id = $4 RETURNING *`, // <--- Asegúrate de que esta indentación sea EXACTA (6 espacios)
      [updateData.nombre, updateData.email, updateData.contraseña, userId]
    )
  })

  // Prueba para el método delete
  it("debería eliminar un usuario de la base de datos", async () => {
    const userId = 1
    db.query.mockResolvedValue({}) // delete no devuelve filas, solo confirma la operación

    await UsuarioDao.delete(userId)

    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith("DELETE FROM usuario WHERE id = $1", [
      userId,
    ])
  })

  // Prueba para el método findByEmail
  it("debería encontrar un usuario por su email", async () => {
    const userEmail = "findme@example.com"
    const mockUser = { id: 5, nombre: "Finder", email: userEmail }
    db.query.mockResolvedValue({ rows: [mockUser] })

    const result = await UsuarioDao.findByEmail(userEmail)

    expect(result).toEqual(mockUser)
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM usuario WHERE email = $1",
      [userEmail]
    )
  })

  it("debería devolver undefined si el usuario no se encuentra por email", async () => {
    db.query.mockResolvedValue({ rows: [] })

    const result = await UsuarioDao.findByEmail("nonexistent@example.com")

    expect(result).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM usuario WHERE email = $1",
      ["nonexistent@example.com"]
    )
  })
})
