const express = require('express');
const router = express.Router();
const estadoSolicitudController = require('../controllers/estadoSolicitud.controller');

// CRUD básico
router.get('/', estadoSolicitudController.getAll);
router.get('/:id', estadoSolicitudController.getById);
router.post('/', estadoSolicitudController.create);
router.put('/:id', estadoSolicitudController.update);
router.delete('/:id', estadoSolicitudController.remove);

module.exports = router;
