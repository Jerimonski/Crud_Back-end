import express from "express"
import reporteController from "../controllers/reporteController.js"

const router = express.Router()

router.get("/reporte-completo", reporteController.descargarReporteCompleto)

export default router
