import { Router } from "express"
import DeporteController from "../controllers/deporteController.js"

const router = Router()

router.get("/", DeporteController.getAll)
router.get("/:id", DeporteController.getById)
router.post("/", DeporteController.create)
router.put("/:id", DeporteController.update)
router.delete("/:id", DeporteController.delete)

export default router
