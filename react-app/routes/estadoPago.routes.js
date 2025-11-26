const express = require('express');
const router = express.Router();
const estadoPagoController = require('../controllers/estadoPago.controller');
router.get('/', estadoPagoController.getAll);
router.get('/:id', estadoPagoController.getById);
router.post('/', estadoPagoController.create);
router.put('/:id', estadoPagoController.update);
router.delete('/:id', estadoPagoController.delete);
module.exports = router;
