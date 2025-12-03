const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol.controller');

router.get('/', rolController.getAll);
router.post('/', rolController.create);
router.get('/:id', rolController.getById);
router.put('/:id', rolController.update);
router.delete('/:id', rolController.delete);
module.exports = router;
