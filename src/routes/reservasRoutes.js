import express from "express"
import reservasController from "../controllers/reservasController.js"

const router = express.Router()

router.post("/", reservasController.create)
router.get("/", reservasController.getAll)
router.delete("/:id", reservasController.delete)

export default router
