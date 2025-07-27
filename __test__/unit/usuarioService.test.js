// __test__/unit/usuarioService.test.js

// Importa el servicio REAL que vas a probar
import UsuarioService from "../../src/services/usuarioService.js"
// Importa el DAO real (solo para Jest, no se usa directamente en el test)
// Lo mantenemos para que Jest sepa qué módulo mockear
import UsuarioDao from "../../src/daos/usuarioDao.js" // Esto es importante para el mocking

// SOLO importa 'jsonwebtoken' porque 'bcrypt' no se usa en tu servicio actual
import jwt from "jsonwebtoken"

// *** CAMBIO CLAVE AQUÍ: La definición del mock para UsuarioDao ***
// En lugar de `{ default: mockInstance }`, vamos a devolver directamente la instancia mockeada.
// Esto a veces ayuda a Jest a resolver correctamente cuando hay problemas con 'default'.
jest.mock("../../src/daos/usuarioDao.js", () => ({
  // Directamente devolvemos el objeto con los métodos mockeados
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByEmail: jest.fn(),
}))
// ***************************************************************

// Mockear solo 'jsonwebtoken'
jest.mock("jsonwebtoken")

describe("UsuarioService - Pruebas Unitarias", () => {
  beforeEach(() => {
    jest.clearAllMocks() // Limpia los mocks antes de cada prueba
  })

  // Prueba para el método 'create'
  it("debería crear un nuevo usuario", async () => {
    const userData = {
      nombre: "Nuevo Usuario",
      email: "nuevo@example.com",
      contraseña: "contraseñaPlana",
      rol: "usuario",
    }
    const createdUser = { id: 1, ...userData }

    // Aquí, accedemos a los mocks directamente desde el módulo importado 'UsuarioDao'
    // porque el mock devuelve los métodos directamente, no bajo una propiedad 'default'.
    // Jest se encarga de remapear esto si el servicio espera un 'default'.
    UsuarioDao.create.mockResolvedValue(createdUser) // CAMBIO: Antes UsuarioDao.default.create

    const result = await UsuarioService.create(userData)

    expect(result).toEqual(createdUser)
    UsuarioDao.create.mock.calls[0][0].contraseña = "hidden" // Opcional: Ocultar contraseña plana del log de mock calls
    expect(UsuarioDao.create).toHaveBeenCalledTimes(1)
    expect(UsuarioDao.create).toHaveBeenCalledWith(userData)
  })

  // Prueba para el método 'login'
  it("debería devolver un token si las credenciales son válidas", async () => {
    const email = "test@example.com"
    const contraseña = "password123"
    const foundUser = {
      id: 1,
      email,
      contraseña: "password123",
      rol: "usuario",
      nombre: "Usuario de Prueba",
    }
    const token = "fake-jwt-token"

    // Accedemos a los mocks directamente desde 'UsuarioDao'
    UsuarioDao.findByEmail.mockResolvedValue(foundUser) // CAMBIO: Antes UsuarioDao.default.findByEmail
    jwt.sign.mockReturnValue(token)

    const result = await UsuarioService.login(email, contraseña)

    expect(result).toEqual({
      token,
      usuario: {
        id: foundUser.id,
        email: foundUser.email,
        nombre: foundUser.nombre,
        rol: foundUser.rol,
      },
    })
    expect(UsuarioDao.findByEmail).toHaveBeenCalledTimes(1)
    expect(UsuarioDao.findByEmail).toHaveBeenCalledWith(email)
    expect(jwt.sign).toHaveBeenCalledTimes(1)
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: foundUser.id,
        email: foundUser.email,
        nombre: foundUser.nombre,
        rol: foundUser.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
  })

  it("no debería devolver token si la contraseña es inválida", async () => {
    const email = "test@example.com"
    const contraseña = "wrongpassword"
    const foundUser = {
      id: 1,
      email,
      contraseña: "correctpassword",
      rol: "usuario",
      nombre: "Usuario de Prueba",
    }

    UsuarioDao.findByEmail.mockResolvedValue(foundUser) // CAMBIO: Antes UsuarioDao.default.findByEmail

    const result = await UsuarioService.login(email, contraseña)

    expect(result).toBeNull()
    expect(UsuarioDao.findByEmail).toHaveBeenCalledTimes(1)
    expect(jwt.sign).not.toHaveBeenCalled()
  })

  it("no debería devolver token si el usuario no existe", async () => {
    const email = "nonexistent@example.com"
    const contraseña = "password123"

    UsuarioDao.findByEmail.mockResolvedValue(undefined) // CAMBIO: Antes UsuarioDao.default.findByEmail

    const result = await UsuarioService.login(email, contraseña)

    expect(result).toBeNull()
    expect(UsuarioDao.findByEmail).toHaveBeenCalledTimes(1)
    expect(jwt.sign).not.toHaveBeenCalled()
  })

  // --- Pruebas para otros métodos existentes en tu UsuarioService ---

  it("debería obtener todos los usuarios", async () => {
    const mockUsers = [{ id: 1, nombre: "User1", email: "user1@test.com" }]
    UsuarioDao.getAll.mockResolvedValue(mockUsers) // CAMBIO: Antes UsuarioDao.default.getAll
    const users = await UsuarioService.getAll()
    expect(users).toEqual(mockUsers)
    expect(UsuarioDao.getAll).toHaveBeenCalledTimes(1)
  })

  it("debería obtener un usuario por ID", async () => {
    const userId = 1
    const mockUser = { id: userId, nombre: "User1", email: "user1@test.com" }
    UsuarioDao.getById.mockResolvedValue(mockUser) // CAMBIO: Antes UsuarioDao.default.getById
    const user = await UsuarioService.getById(userId)
    expect(user).toEqual(mockUser)
    expect(UsuarioDao.getById).toHaveBeenCalledTimes(1)
    expect(UsuarioDao.getById).toHaveBeenCalledWith(userId)
  })

  it("debería eliminar un usuario por ID", async () => {
    const userId = 1
    UsuarioDao.delete.mockResolvedValue(undefined) // CAMBIO: Antes UsuarioDao.default.delete
    await UsuarioService.delete(userId)
    expect(UsuarioDao.delete).toHaveBeenCalledTimes(1)
    expect(UsuarioDao.delete).toHaveBeenCalledWith(userId)
  })

  it("debería actualizar un usuario", async () => {
    const userId = 1
    const updateData = {
      nombre: "Usuario Actualizado",
      email: "updated@example.com",
      contraseña: "nuevaContraseñaPlana",
    }
    const updatedUser = { id: userId, ...updateData }
    UsuarioDao.update.mockResolvedValue(updatedUser) // CAMBIO: Antes UsuarioDao.default.update
    const result = await UsuarioService.update(userId, updateData)
    expect(result).toEqual(updatedUser)
    expect(UsuarioDao.update).toHaveBeenCalledTimes(1)
    expect(UsuarioDao.update).toHaveBeenCalledWith(userId, updateData)
  })
})
