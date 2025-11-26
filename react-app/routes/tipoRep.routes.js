const express = require('express');
const router = express.Router();
const tipoRepController = require('../controllers/tipoRep.controller');
router.get('/', tipoRepController.getAll);
router.get('/:id', tipoRepController.getById);
router.post('/', tipoRepController.create);
router.put('/:id', tipoRepController.update);
router.delete('/:id', tipoRepController.delete);
module.exports = router;
