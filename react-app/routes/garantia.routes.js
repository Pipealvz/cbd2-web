const express = require('express');
const router = express.Router();
const garantiaController = require('../controllers/garantia.controller');

// CRUD básico
router.get('/', garantiaController.getAll);
router.get('/:id', garantiaController.getById);
router.post('/', garantiaController.create);
router.put('/:id', garantiaController.update);
router.delete('/:id', garantiaController.remove);

module.exports = router;