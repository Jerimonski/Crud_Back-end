import express from "express"
import horariosController from "../controllers/horariosController.js"

const router = express.Router()

router.post("/", horariosController.create)
router.get("/disponibles", horariosController.getAvailable)
router.get("/base", horariosController.getAllBase) // AÑADIDA: Nueva ruta para obtener horarios base

export default router
