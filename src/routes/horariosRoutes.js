import express from "express"
import horariosController from "../controllers/horariosController.js"

const router = express.Router()

router.get("/disponibles", horariosController.getAvailable)

export default router
