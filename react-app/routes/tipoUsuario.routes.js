const express = require('express');
const router = express.Router();
const tipoUsuarioController = require('../controllers/tipoUsuario.controller');

// CRUD básico
router.get('/', tipoUsuarioController.getAll);
router.get('/:id', tipoUsuarioController.getById);
router.post('/', tipoUsuarioController.create);
router.put('/:id', tipoUsuarioController.update);
router.delete('/:id', tipoUsuarioController.remove);

module.exports = router;