const express = require("express");
const router = express.Router();

// Importar las rutas individuales
const metodoPagoRoutes = require("./metodoPago.routes");
const estadoPagoRoutes = require("./estadoPago.routes");
const marcaRoutes = require("./marca.routes");
const tipoRepRoutes = require("./tipoRep.routes");

// Agrupar las rutas bajo un prefijo
router.use("/metodo-pago", metodoPagoRoutes);
router.use("/estado-pago", estadoPagoRoutes);
router.use("/marca", marcaRoutes);
router.use("/tipo-rep", tipoRepRoutes);

// Ruta base
router.get("/", (req, res) => {
    res.send("API funcionando correctamente 🚀");
});

module.exports = router;
