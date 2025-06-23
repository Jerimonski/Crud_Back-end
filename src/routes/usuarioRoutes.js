<<<<<<< HEAD
const express = require("express")
const router = express.Router()
const usuarioController = require("../controllers/usuarioController")
=======
import express from 'express';
const router = express.Router();
import usuarioController from '../controllers/usuarioController.js';
>>>>>>> a17cb312113f304b816a1942d7fd8f28b9eff55d

router.get("/", usuarioController.getAll)
router.get("/:id(\\d+)", usuarioController.getById)
router.post("/", usuarioController.create)
router.put("/:id", usuarioController.update)
router.delete("/:id", usuarioController.delete)

<<<<<<< HEAD
module.exports = router
=======

export default router;
>>>>>>> a17cb312113f304b816a1942d7fd8f28b9eff55d
