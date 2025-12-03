const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfil.controller');

router.get('/', perfilController.getAll);
router.post('/', perfilController.create);
router.get('/:id', perfilController.getById);
router.put('/:id', perfilController.update);
router.delete('/:id', perfilController.delete);

module.exports = router;
