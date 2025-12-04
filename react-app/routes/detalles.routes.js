const { Router } = require("express");
const { getDetalleSolicitud } = require("../controllers/detalles.controller");

const router = Router();

// GET /solicitud/:id
router.get("/:id", getDetalleSolicitud);

module.exports = router;