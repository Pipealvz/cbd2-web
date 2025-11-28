const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitud.controller');
const { verifyTokenMiddleware } = require('../middleware/authMiddleware');

// CRUD básico
router.get('/', solicitudController.getAll);
router.get('/:id', solicitudController.getById);
router.post('/', solicitudController.create);
router.put('/:id', solicitudController.update);
router.delete('/:id', solicitudController.remove);
router.get('/user', verifyTokenMiddleware, solicitudController.getAllUser);

module.exports = router;
