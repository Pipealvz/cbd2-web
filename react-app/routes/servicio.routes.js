const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicio.controller');

// CRUD básico
router.get('/', servicioController.getAll);
router.get('/:id', servicioController.getById);
router.post('/', servicioController.create);
router.put('/:id', servicioController.update);
router.delete('/:id', servicioController.remove);

module.exports = router;