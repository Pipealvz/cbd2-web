const express = require('express');
const router = express.Router();
const detalleRepuestoController = require('../controllers/detalleRepuesto.controller');

// Rutas CRUD
router.get('/', detalleRepuestoController.getAll);
router.get('/:id', detalleRepuestoController.getById);
router.post('/', detalleRepuestoController.create);
router.put('/:id', detalleRepuestoController.update);
router.delete('/:id', detalleRepuestoController.remove);

module.exports = router;