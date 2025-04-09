const express = require("express");
const cors = require("cors");
const app = express();

/*
carga las rutas
 */
const usuarioRoutes = require("./routes/usuarioRoutes");

app.use(cors());
app.use(express.json());
/*
cañade un prefijo a la ruta
 */
app.use("/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

//const express = require("express")
//const cors = require("cors")
//const app = express()
//const port = 3000

//let items = []

//app.use(
//  express.urlencoded({s
//    extended: true,
//  })
//)

//app.use(
//  express.json({
//    type: "*/*",
//  })
//)

//app.use(cors())

//app.get("/", (req, res) => {
//  res.status(200).send({ data: items })
//})

//app.post("/", (req, res) => {
//  const { description, value } = req.body
//  const newItem = { description, value }
//  items.push(newItem)
//  console.log(req.body)
//  res.status(200).send({ message: "Data received successfully" })
//})

//app.listen(port, () => {
//  console.log(`is running in http://localhost:${port}`)
//})
