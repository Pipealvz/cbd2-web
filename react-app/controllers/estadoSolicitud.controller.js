const db = require('../config/db-oracle');

// Obtener todos los estados de solicitud
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM EstadoSolicitud`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener estado por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute(
      `SELECT * FROM EstadoSolicitud WHERE id_estado = :id`,
      [id]
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo estado
exports.create = async (req, res) => {
  try {
    const { id_estado, nombre_estado } = req.body;

    await db.execute(
      `INSERT INTO EstadoSolicitud (
        id_estado,
        nombre_estado
      ) VALUES (
        :id_estado,
        :nombre_estado
      )`,
      [id_estado, nombre_estado]
    );

    res.status(201).json({ message: 'Estado de solicitud creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar estado
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_estado } = req.body;

    await db.execute(
      `UPDATE EstadoSolicitud
       SET nombre_estado = :nombre_estado
       WHERE id_estado = :id`,
      [nombre_estado, id]
    );

    res.json({ message: 'Estado de solicitud actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar estado
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM EstadoSolicitud WHERE id_estado = :id`,
      [id]
    );

    res.json({ message: 'Estado de solicitud eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
