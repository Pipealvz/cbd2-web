const db = require('../config/db-oracle');

exports.getAllUser = async (req, res) => {
  try {
    const userId = req.user?.id_persona;
    if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const result = await db.execute(
      `SELECT * FROM Solicitud WHERE id_persona = :userId`,
      { userId }
    );

    res.json(result.rows || []); // si no hay datos, devuelve array vacío
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// ======================================================
// OBTENER TODAS LAS SOLICITUDES
// ======================================================
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM Solicitud`);
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ======================================================
// OBTENER SOLICITUD POR ID
// ======================================================
exports.getById = async (req, res) => {
  try {
    const { id_solicitud } = req.params;

    const result = await db.execute(
      `
          SELECT 
              s.ID_SOLICITUD,
              s.ID_FACTURA,
              s.ID_PERSONA,
              s.ID_PERSONA_EMPLEADO,
              s.ID_ESTADO,
              s.OBSERVACIONES,
              s.ID_GARANTIA,
              s.ID_EQUIPO,
              s.ID_SERVICIO,
              s.FECHA_CREACION,       
              s.ID_TIPOUS,            
              serv.NOMBRE_SERVICIO,
              p.CORREO,
              e.NOMBRE AS NOMBRE_EMPLEADO
              FROM Solicitud s
              LEFT JOIN Servicio serv
                  ON serv.ID_SERVICIO = s.ID_SERVICIO
              LEFT JOIN Tipo_usuario tus           
              ON tus.ID_TIPOUS = s.ID_TIPOUS
              LEFT JOIN Persona p
              ON p.ID_PERSONA = s.ID_PERSONA
              LEFT JOIN Persona e
              ON e.ID_PERSONA = s.ID_PERSONA_EMPLEADO
          WHERE s.ID_SOLICITUD = :id_solicitud
            `,
      [id_solicitud]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ======================================================
// CREAR SOLICITUD
// ======================================================
exports.create = async (req, res) => {
  try {
    const data = req.body;

    const sql = `
      INSERT INTO Solicitud (
        id_solicitud, id_factura, id_persona, id_persona_empleado,
        id_estado, observaciones, id_equipo,
        fecha_creacion, id_servicio, id_tipous
      ) VALUES (
        :id_solicitud, :id_factura, :id_persona, :id_persona_empleado,
        :id_estado, :observaciones, :id_equipo,
        TO_DATE(:fecha_creacion, 'YYYY-MM-DD'),
        :id_servicio, :id_tipous
      )
    `;

    await db.execute(sql, data, { autoCommit: true });

    res.status(201).json({ message: "Solicitud creada correctamente" });

  } catch (err) {
    console.error("ERROR create:", err);
    res.status(500).json({ error: err.message });
  }
};



// ======================================================
// ACTUALIZAR SOLICITUD
// ======================================================
exports.update = async (req, res) => {
  try {
    const { id_solicitud } = req.params;

    // LOG 1: Verificar que se recibió la ruta
    console.log('\n=== ACTUALIZAR SOLICITUD ===');
    console.log('ID recibido:', id_solicitud);
    console.log('Payload recibido:', JSON.stringify(req.body, null, 2));

    const {
      id_estado,
      observaciones,
      id_garantia,
      id_servicio,
      id_tipous
    } = req.body;

    // LOG 2: Verificar cada campo
    console.log('Campos extraídos:', {
      id_solicitud,
      id_estado,
      observaciones,
      id_garantia,
      id_servicio,
      id_tipous
    });

    const sql = `
      UPDATE SOLICITUD
      SET
        ID_ESTADO = :id_estado,
        OBSERVACIONES = :observaciones,
        ID_GARANTIA = :id_garantia,
        ID_SERVICIO = :id_servicio,
        ID_TIPOUS = :id_tipous
      WHERE ID_SOLICITUD = :id_solicitud
    `;

    console.log('SQL:', sql);

    const result = await db.execute(
      sql,
      {
        id_solicitud,
        id_estado,
        observaciones,
        id_garantia,
        id_servicio,
        id_tipous
      },
      { autoCommit: true }
    );

    // LOG 3: Verificar resultado
    console.log('Resultado de ejecución:', result);
    console.log('Rows afectadas:', result.rowsAffected);
    console.log('=== FIN ACTUALIZAR ===\n');

    res.json({ 
      message: "Solicitud actualizada correctamente",
      rowsAffected: result.rowsAffected 
    });

  } catch (err) {
    console.error('=== ERROR EN UPDATE ===');
    console.error('Mensaje:', err.message);
    console.error('Stack:', err.stack);
    console.error('=== FIN ERROR ===\n');
    res.status(500).json({ error: err.message });
  }
};



// ======================================================
// ELIMINAR SOLICITUD
// ======================================================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM Solicitud WHERE id_solicitud = :id`,
      { id },
      { autoCommit: true }
    );

    return res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

};
