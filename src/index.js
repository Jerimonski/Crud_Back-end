const express = require("express")
const cors = require("cors")
const usuarioRoutes = require("./routes/usuarioRoutes")
const comentariosRouter = require("./routes/comentarios")
const app = express()

/*
carga las rutas
 */

app.use(cors({
  origin: 'http://38.242.243.201',
  credentials: true
}));
app.use(express.json())
/*
cañade un prefijo a la ruta
 */
app.use("/usuarios", usuarioRoutes)
app.use("/comentarios", comentariosRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`)
})