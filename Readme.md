# Crud_Back-end

Este repositorio contiene el backend de un proyecto CRUD desarrollado con Node.js, Express y PostgreSQL.

Está pensado para trabajar conectado a un frontend (como el de Crud_Front-end), pero también es totalmente funcional por sí solo mediante herramientas de prueba como Postman.

# Requisitos previos

Antes de iniciar, asegúrate de tener instalado:

Node.js y npm

Git Bash (u otro terminal compatible)

PostgreSQL

Postman (opcional, para pruebas)

# instalación y ejecución

Inicializa el proyecto (si estás comenzando desde cero):
npm init -y
Este comando fue probado en Git Bash. Otros terminales podrían variar.

Instala las dependencias necesarias:
npm install express pg dotenv
npm install --save-dev nodemon

No olvides ejecutar también npm install si descargas el proyecto con un package.json ya creado, para que se instalen todas las dependencias.

# Iniciar el servidor:
En local apuntando a base de datos local
npm start
En desarrollo apuntando a la base de datos en el servidor
npm start:dev
Para prod usar el
npm start:prod
npx nodemon src/index.js

# Pruebas con Postman

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
"email": "juan@example.com",
"contraseña": "secreta"
}

No incluyas el campo id, ya que se genera automáticamente en la base de datos. No se ha probado qué ocurre si se fuerza ese campo, así que es mejor no hacerlo.

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

# Solución de problemas

Nos enfrentamos a una situación donde todo funcionaba correctamente excepto el método POST. Después de revisar el código del backend sin encontrar errores, descubrimos que el problema estaba relacionado con los permisos del usuario de PostgreSQL definidos en el archivo .env.

Para solucionarlo, se accedió al servidor de la base de datos usando PuTTY, y desde allí se otorgaron los permisos necesarios al usuario.

# Buenas prácticas

Haz commit regularmente y sube los cambios a GitHub para evitar pérdidas de información.

Sigue el mismo flujo de trabajo y convenciones definidas en el repositorio del frontend.

Asegúrate de tener configurado correctamente tu archivo .env (no incluido por seguridad) para que las variables de entorno se conecten a tu base de datos local.

# Estructura del proyecto (explicación para quien comienza)

     Este proyecto fue hecho por alguien que no comenzó como desarrolladora backend, así que si te toca continuar este trabajo y estás en una situación parecida: respira, que todo se puede aprender. Esta es una guía para que no te sientas tan perdido/a como yo al principio.

La estructura de carpetas está organizada de la forma más simple posible para que sea fácil entender qué hace cada parte:

Crud_Back-end/
├── node_modules/ ← Se genera automáticamente al instalar dependencias con npm
├── src/ ← Aquí va todo el código principal del backend
│ ├── db/ ← Archivo de conexión con la base de datos
│ ├── routes/ ← Aquí están las rutas o endpoints del servidor (por ejemplo: GET, POST de usuarios)
│ ├── controllers/ ← Aquí están las funciones que definen la lógica (lo que hace cada endpoint)
│ └── index.js ← Archivo que levanta el servidor y conecta todo
├── .env ← Variables sensibles como usuario y contraseña de la base de datos (NO subir a GitHub)
├── .gitignore ← Archivos y carpetas que no deben subirse al repositorio (como node_modules o .env)
├── package.json ← Lista de dependencias, scripts y metadatos del proyecto
└── README.md ← Este mismo documento, con instrucciones y contexto

# ¿Por qué está todo separado?

db/: Separar la conexión a la base de datos te permite modificarla sin tocar el resto del código. Es útil si cambias de entorno (por ejemplo: de local a producción).

routes/: Aquí defines las “puertas” por donde se accede a tu backend. Por ejemplo, qué pasa cuando se hace un GET a /usuarios/.

controllers/: Aquí está lo que realmente hacen las rutas. La lógica va separada para que el código esté más limpio y ordenado.

index.js: Es el punto de entrada del servidor. Aquí se juntan las rutas, la base de datos y se levanta el servidor con Express.
