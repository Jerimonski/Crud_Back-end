const express = require("express")
const cors = require("cors")
const app = express()
const port = 3000

let items = []

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(
  express.json({
    type: "*/*",
  })
)

app.use(cors())

app.get("/", (req, res) => {
  res.status(200).send({ data: items })
})

app.post("/", (req, res) => {
  const { description, value } = req.body
  const newItem = { description, value }
  items.push(newItem)
  console.log(req.body)
  res.status(200).send({ message: "Data received successfully" })
})

app.listen(port, () => {
  console.log(`im fokin running in http://localhost:${port}`)
})
