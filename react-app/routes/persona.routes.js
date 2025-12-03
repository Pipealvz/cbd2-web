const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller');
const { verifyTokenMiddleware } = require('../middleware/authMiddleware');

// Rutas específicas primero
router.get('/user/:id', verifyTokenMiddleware, personaController.getByUser);

// CRUD básico
router.get('/', personaController.getAll);
router.get('/:id', personaController.getById);
router.post('/', personaController.create);
router.put('/:id', personaController.update);
router.delete('/:id', personaController.remove);

module.exports = router;
