import { Router } from "express"
import DeportesController from "../controllers/deportesController.js"

const router = Router()

router.get("/", DeportesController.getAll)
router.get("/:id", DeportesController.getById)
router.post("/", DeportesController.create)
router.put("/:id", DeportesController.update)
router.delete("/:id", DeportesController.delete)

export default router
