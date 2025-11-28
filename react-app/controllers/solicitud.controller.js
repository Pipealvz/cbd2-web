const db = require('../config/db-oracle');

exports.getAllUser = async (req, res) => {
  try {
    // Validar que el middleware de auth envió el id del usuario
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado o token inválido." });
    }

    // Consulta que solo obtiene solicitudes del usuario logueado
    const result = await db.execute(
      `SELECT * FROM Solicitud WHERE usuario_id = ?`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las solicitudes
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM Solicitud`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener solicitud por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute(
      `SELECT * FROM Solicitud WHERE id_solicitud = :id`,
      [id]
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva solicitud
exports.create = async (req, res) => {
  const userId = req.user?.id_persona;
  try {
    const {
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

    // --- Normalizar la fecha ---
    let fechaOracle = fecha_creacion;
    // Si trae milisegundos → los quitamos
    if (fechaOracle.includes('.')) {
      fechaOracle = fechaOracle.split('.')[0];
    }
    // Si trae Z al final → se quita
    fechaOracle = fechaOracle.replace('Z', '');
    // Si viene sin "T", agregarla
    if (fechaOracle.includes(' ') && !fechaOracle.includes('T')) {
      fechaOracle = fechaOracle.replace(' ', 'T');
    }

    // --- Query con binding por nombre ---
    await db.execute(
      `
      INSERT INTO Solicitud (
        id_solicitud, id_factura, id_persona, id_persona_empleado, id_estado,
        observaciones, id_garantia, id_equipo, fecha_creacion, id_servicio, id_tipous
      ) VALUES (
        :id_solicitud, :id_factura, :id_persona, :id_persona_empleado, :id_estado,
        :observaciones, :id_garantia, :id_equipo,
        TO_DATE(:fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
        :id_servicio, :id_tipous
      )
      `,
      {
        id_solicitud,
        id_factura,
        id_persona,
        id_persona_empleado,
        id_estado,
        observaciones,
        id_garantia,
        id_equipo,
        fecha_creacion: fechaOracle,
        id_servicio,
        id_tipous
      }
    );

    res.status(201).json({ message: 'Solicitud creada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Actualizar solicitud
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
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

    await db.execute(
      `UPDATE Solicitud
       SET
        id_factura = :id_factura,
        id_persona = :id_persona,
        id_persona_empleado = :id_persona_empleado,
        id_estado = :id_estado,
        observaciones = :observaciones,
        id_garantia = :id_garantia,
        id_equipo = :id_equipo,
        fecha_creacion = :fecha_creacion,
        id_servicio = :id_servicio,
        id_tipous = :id_tipous
       WHERE id_solicitud = :id`,
      [
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
      ]
    );

    res.json({ message: 'Solicitud actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar solicitud
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM Solicitud WHERE id_solicitud = :id`,
      [id]
    );

    res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};