
const db = require('../config/db-oracle');

// Obtener todos los repuestos
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM Repuesto`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener repuesto por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute(
      `SELECT * FROM Repuesto WHERE id_repuesto = :id`,
      [id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo repuesto
exports.create = async (req, res) => {
  try {
    const { id_repuesto, nombre_rep, descripcion_rep } = req.body;
    await db.execute(
      `INSERT INTO Repuesto (id_repuesto, nombre_rep, descripcion_rep)
       VALUES (:id_repuesto, :nombre_rep, :descripcion_rep)`,
      [id_repuesto, nombre_rep, descripcion_rep]
    );
    res.status(201).json({ message: 'Repuesto creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar repuesto
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_rep, descripcion_rep } = req.body;
    await db.execute(
      `UPDATE Repuesto
       SET nombre_rep = :nombre_rep,
           descripcion_rep = :descripcion_rep
       WHERE id_repuesto = :id`,
      [nombre_rep, descripcion_rep, id]
    );
    res.json({ message: 'Repuesto actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar repuesto
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(
      `DELETE FROM Repuesto WHERE id_repuesto = :id`,
      [id]
    );
    res.json({ message: 'Repuesto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};