const db = require('../config/db-oracle');

// Obtener todos los servicios
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM Servicio`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener servicio por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute(
      `SELECT * FROM Servicio WHERE id_servicio = :id`,
      [id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo servicio
exports.create = async (req, res) => {
  try {
    const { id_servicio, nombre_servicio, descripcion, precio_base } = req.body;

    await db.execute(
      `INSERT INTO Servicio (id_servicio, nombre_servicio, descripcion, precio_base)
       VALUES (:id_servicio, :nombre_servicio, :descripcion, :precio_base)`,
      [id_servicio, nombre_servicio, descripcion, precio_base]
    );

    res.status(201).json({ message: 'Servicio creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar servicio
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_servicio, descripcion, precio_base } = req.body;

    await db.execute(
      `UPDATE Servicio
       SET nombre_servicio = :nombre_servicio,
           descripcion = :descripcion,
           precio_base = :precio_base
       WHERE id_servicio = :id`,
      [nombre_servicio, descripcion, precio_base, id]
    );

    res.json({ message: 'Servicio actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar servicio
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM Servicio WHERE id_servicio = :id`,
      [id]
    );

    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
