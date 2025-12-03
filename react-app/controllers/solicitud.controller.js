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
      `SELECT * FROM Solicitud WHERE id_solicitud = :id_solicitud`,
      { id_solicitud}
    );

    return res.json(result.rows[0] || null);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ======================================================
// CREAR SOLICITUD
// ======================================================
exports.create = async (req, res) => {
  try {
    let {
      id_solicitud,
      id_factura,
      id_persona,
      id_persona_empleado,
      id_estado,
      observaciones,
      id_garantia,
      id_equipo,
      fecha_creacion,
      id_servicio,
      id_tipous
    } = req.body;

    // Normalizar fecha
    if (fecha_creacion) {
      fecha_creacion = fecha_creacion.replace("Z", "").split(".")[0];
    }

    const sql = `
      INSERT INTO Solicitud (
        id_solicitud, id_factura, id_persona, id_persona_empleado, id_estado,
        observaciones, id_garantia, id_equipo, fecha_creacion, id_servicio, id_tipous
      )
      VALUES (
        :id_solicitud, :id_factura, :id_persona, :id_persona_empleado, :id_estado,
        :observaciones, :id_garantia, :id_equipo,
        ${fecha_creacion ? "TO_DATE(:fecha_creacion, 'YYYY-MM-DD\"T\"HH24:MI:SS')" : "NULL"},
        :id_servicio, :id_tipous
      )
    `;

    const result = await db.execute(
      sql,
      {
        id_solicitud,
        id_factura,
        id_persona,
        id_persona_empleado,
        id_estado,
        observaciones,
        id_garantia,
        id_equipo,
        fecha_creacion,
        id_servicio,
        id_tipous
      },
      { autoCommit: true }
    );

    return res.status(201).json({ message: 'Solicitud creada correctamente' });

  } catch (err) {
    console.error("ERROR create:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ======================================================
// ACTUALIZAR SOLICITUD
// ======================================================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      id_persona_empleado,
      id_estado,
      observaciones,
      id_equipo,
      id_servicio,
      id_tipous
    } = req.body;

    if (fecha_creacion) {
      fecha_creacion = fecha_creacion.replace("Z", "").split(".")[0];
    }

    await db.execute(
      `
      UPDATE Solicitud SET
        id_factura = :id_factura,
        id_persona = :id_persona,
        id_persona_empleado = :id_persona_empleado,
        id_estado = :id_estado,
        observaciones = :observaciones,
        id_garantia = :id_garantia,
        id_equipo = :id_equipo,
        fecha_creacion = ${fecha_creacion ? "TO_DATE(:fecha_creacion, 'YYYY-MM-DD\"T\"HH24:MI:SS')" : "NULL"},
        id_servicio = :id_servicio,
        id_tipous = :id_tipous
      WHERE id_solicitud = :id
      `,
      {
        id_factura,
        id_persona,
        id_persona_empleado,
        id_estado,
        observaciones,
        id_garantia,
        id_equipo,
        fecha_creacion,
        id_servicio,
        id_tipous,
        id
      },
      { autoCommit: true }
    );

    return res.json({ message: 'Solicitud actualizada correctamente' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
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
