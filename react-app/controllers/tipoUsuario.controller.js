const db = require('../config/db-oracle');

// Obtener todos los tipos de usuario
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM tipo_usuario`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener tipo de usuario por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute(
      `SELECT * FROM tipo_usuario WHERE ID_TIPOUS = :id`,
      [id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo tipo de usuario
exports.create = async (req, res) => {
  try {
    const { ID_TIPOUS, NOMBRE_TIPOUS } = req.body;

    await db.execute(
      `INSERT INTO tipo_usuario (ID_TIPOUS, NOMBRE_TIPOUS)
       VALUES (:ID_TIPOUS, :NOMBRE_TIPOUS)`,
      [ID_TIPOUS, NOMBRE_TIPOUS]
    );

    res.status(201).json({ message: 'Tipo de usuario creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar tipo de usuario
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { NOMBRE_TIPOUS } = req.body;

    await db.execute(
      `UPDATE tipo_usuario
       SET NOMBRE_TIPOUS = :NOMBRE_TIPOUS
       WHERE ID_TIPOUS = :id`,
      [NOMBRE_TIPOUS, id]
    );

    res.json({ message: 'Tipo de usuario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar tipo de usuario
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM tipo_usuario WHERE ID_TIPOUS = :id`,
      [id]
    );

    res.json({ message: 'Tipo de usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
