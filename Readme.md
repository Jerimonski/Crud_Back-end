# no tocar, para activar solo seguir instrucciones hasta npm install

# Como inicio el proyecto

Inicializa un proyecto Node.js

    npm init -y

Instala las dependencias necesarias

    npm install express pg dotenv
    npm install --save-dev nodemon

#

# Cuando descargan el proyecto no olvidad hacer el npm install para cargar las dependencias del package.json

    npm install

# Iniciar en localhost

npx nodemon src/index.js

# Probar en postman

get usuario by id
http://localhost:3000/usuarios/1

get all usuario
http://localhost:3000/usuarios/

crear usuario

    Método HTTP: POST

Escribe la URL: http://localhost:3000/usuarios.

En la pestaña Body, selecciona raw y elige JSON en el menú desplegable.

Escribe los datos en formato JSON:

{
"nombre": "Juan",
"apellido": "Pérez",
"fecha_nacimiento": 19900101,
"email": "juan@example.com",
"contraseña": "secreta"
}

Actualizar un usuario (PUT /usuarios/:id)

    Método HTTP: PUT

    URL: http://localhost:3000/usuarios/{id} (reemplaza {id} con el ID del usuario que quieres actualizar).

    Cuerpo de la solicitud: Debes enviar un objeto JSON con los nuevos datos para el usuario.

Eliminar un usuario (DELETE /usuarios/:id)

    Método HTTP: DELETE

    URL: http://localhost:3000/usuarios/{id} (reemplaza {id} con el ID del usuario que quieres eliminar).

# Para subir a produccion (servidor)

instalar node en el servidor

copiar el proyecto dentro de /var/wwww
usar filezilla o similar para copiar

Con el proyecto en el servidor isntalar las dependencias
npm install

Usar un gestor de procesos: En lugar de ejecutar node src/index.js, usa un gestor de procesos como PM2 para manejar tu aplicación en producción. PM2 te permite:

    Ejecutar la aplicación en segundo plano.

    Reiniciar la aplicación si falla.

    Administrar las instancias de la aplicación (en caso de que necesites escalar).

Para instalar PM2:

    npm install pm2@latest -g

Para iniciar la aplicación con PM2:

    pm2 start src/index.js --name "taller1-api"

Para detener
pm2 stop "taller1-api"

para reiniciar
pm2 restart "taller1-api"

para ver el estado
pm2 list

Para asegurarte de que PM2 se reinicie automáticamente después de un reinicio del sistema, usa:

pm2 startup
pm2 save
