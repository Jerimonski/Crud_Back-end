import express from "express"
import comentariosController from "../controllers/comentariosController.js"

const router = express.Router()

router.get("/", comentariosController.getAll)
router.post("/", comentariosController.create)
router.get("/", comentariosController.getByDeporte)

export default router
