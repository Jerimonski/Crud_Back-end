import UsuarioDao from "../../src/daos/usuarioDao.js"
import db from "../../src/database/connection.js"

jest.mock("../../src/database/connection.js", () => ({
  query: jest.fn(),
}))

describe("UsuarioDao - Pruebas Unitarias", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("debería obtener todos los usuarios de la base de datos", async () => {
    const mockRows = [
      { id: 1, nombre: "Usuario1", email: "user1@example.com" },
      { id: 2, nombre: "Usuario2", email: "user2@example.com" },
    ]
    db.query.mockResolvedValue({ rows: mockRows })

    const result = await UsuarioDao.getAll()

    expect(result).toEqual(mockRows)
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM usuario")
  })

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
    db.query.mockResolvedValue({ rows: [] })

    const result = await UsuarioDao.getById(999)

    expect(result).toBeUndefined()
    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM usuario WHERE id = $1",
      [999]
    )
  })

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
      `
      INSERT INTO usuario (nombre, email, contraseña)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [newUserData.nombre, newUserData.email, newUserData.contraseña]
    )
  })

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
      `
      UPDATE usuario
      SET nombre = $1, email = $2, contraseña = $3
      WHERE id = $4 RETURNING *`,
      [updateData.nombre, updateData.email, updateData.contraseña, userId]
    )
  })

  it("debería eliminar un usuario de la base de datos", async () => {
    const userId = 1
    db.query.mockResolvedValue({})

    await UsuarioDao.delete(userId)

    expect(db.query).toHaveBeenCalledTimes(1)
    expect(db.query).toHaveBeenCalledWith("DELETE FROM usuario WHERE id = $1", [
      userId,
    ])
  })

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
