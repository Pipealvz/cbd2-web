const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitud.controller');

// CRUD básico
router.get('/', solicitudController.getAll);
router.get('/:id', solicitudController.getById);
router.post('/', solicitudController.create);
router.put('/:id', solicitudController.update);
router.delete('/:id', solicitudController.remove);

module.exports = router;
