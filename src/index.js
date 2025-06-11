import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import comentariosRouter from './routes/comentarios.js';
const app = express()
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
const result = dotenv.config({ path: envFile, override: true });

if (result.error) {
  console.warn(`No se pudo cargar el archivo de entorno ${envFile}`);
} else {
  console.log(`Archivo de entorno cargado: ${envFile}`);
  console.log('Variables de entorno cargadas:');
  console.log({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD: process.env.DB_PASSWORD,
    CORS_ORIGIN: process.env.CORS_ORIGIN
  });
}


app.use(express.json())
/*
carga las rutas
 */

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

/*
añade un prefijo a la ruta
 */
app.use("/usuarios", usuarioRoutes)
app.use("/comentarios", comentariosRouter)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`)
})