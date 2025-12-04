const oracledb = require("oracledb");
const db = require('../config/db-oracle');

// Controlador: traer detalle completo de la solicitud
const getDetalleSolicitud = async (req, res) => {
  const idSolicitud = req.params.id;
  let connection;

  try {
    // obtén conexión desde tu configuración
    connection = await db.getConnection();

    const result = await connection.execute(
      `
      BEGIN 
        sp_detalle_solicitud(
          :p_id_solicitud,
          :p_cursor
        );
      END;`,
      {
        p_id_solicitud: idSolicitud,
        p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    // Obtener cursor
    const cursor = result.outBinds.p_cursor;

    // Convertir cursor a array JS
    const rows = await cursor.getRows();
    await cursor.close();

    return res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error("Error en getDetalleSolicitud:", error);
    return res.status(500).json({
      success: false,
      message: "Error consultando detalle de la solicitud.",
      error: error.message
    });

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error cerrando conexión:", err);
      }
    }
  }
};

module.exports = {
  getDetalleSolicitud
};
