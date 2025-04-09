class UsuarioDto {
  constructor({ nombre, email, contraseña }) {
    this.nombre = nombre;
    this.email = email;
    this.contraseña = contraseña;
  }
}

module.exports = UsuarioDto;
