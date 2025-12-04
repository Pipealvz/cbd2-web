const express = require("express");
const router = express.Router();
const cors = require('cors');

router.use(cors());

// Importar las rutas individuales
const metodoPagoRoutes = require("./metodoPago.routes");
const estadoPagoRoutes = require("./estadoPago.routes");
const marcaRoutes = require("./marca.routes");
const tipoRepRoutes = require("./tipoRep.routes");
const detalleRepuestoRoutes = require("./detalleRepuesto.routes");
const garantiaRoutes = require("./garantia.routes");
const equipoRoutes = require("./equipo.routes");
const serviceRoutes = require("./servicio.routes");
const tipoUsuarioRoutes = require("./tipoUsuario.routes");
const solicitudRoutes = require("./solicitud.routes");
const personaRoutes = require("./persona.routes");
const estadoSolicitudRoutes = require("./estadoSolicitud.routes");
const rolRoutes = require("./rol.routes");
const perfilRoutes = require("./perfil.routes");
const detallesRoutes = require("./detalles.routes");

router.get("/", (req, res) => {
    res.send("API funcionando correctamente");
});

// Agrupar las rutas bajo un prefijo
router.use("/metodo-pago", metodoPagoRoutes);
router.use("/estado-pago", estadoPagoRoutes);
router.use("/marca", marcaRoutes);
router.use("/tipo-rep", tipoRepRoutes);
router.use("/detalle-repuesto", detalleRepuestoRoutes);
router.use("/garantia", garantiaRoutes);
router.use("/equipo", equipoRoutes);
router.use("/servicio", serviceRoutes);
router.use("/tipo-usuario", tipoUsuarioRoutes);
router.use("/solicitud", solicitudRoutes);
router.use("/persona", personaRoutes);
router.use("/estado-solicitud", estadoSolicitudRoutes);
router.use("/rol", rolRoutes);
router.use("/perfil", perfilRoutes);
router.use("/detalles", detallesRoutes);

// Ruta base


module.exports = router;
