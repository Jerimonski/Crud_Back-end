import express from 'express';
const router = express.Router();
import usuarioController from '../controllers/usuarioController.js';

router.get("/", usuarioController.getAll);
router.get("/:id", usuarioController.getById);
router.post("/", usuarioController.create);
router.put("/:id", usuarioController.update);
router.delete("/:id", usuarioController.delete);


export default router;
