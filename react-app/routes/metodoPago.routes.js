const express = require('express');
const router = express.Router();
const metodoPagoController = require('../controllers/metodoPago.controller');
router.get('/', metodoPagoController.getAll);
router.get('/:id', metodoPagoController.getById);
router.post('/', metodoPagoController.create);
router.put('/:id', metodoPagoController.update);
router.delete('/:id', metodoPagoController.delete);
module.exports = router;
