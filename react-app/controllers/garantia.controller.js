const db = require('../db');

// Obtener todas las garantías
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM Garantia');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener garantía por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute(
      'SELECT * FROM Garantia WHERE id_garantia = :id',
      [id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva garantía
exports.create = async (req, res) => {
  try {
    const { id_garantia, fecha_inicio, id_servicio } = req.body;
    await db.execute(
      `INSERT INTO Garantia (id_garantia, fecha_inicio, id_servicio)
       VALUES (:id_garantia, :fecha_inicio, :id_servicio)`,
      [id_garantia, fecha_inicio, id_servicio]
    );
    res.status(201).json({ message: 'Garantía creada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar garantía
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, id_servicio } = req.body;
    await db.execute(
      `UPDATE Garantia
       SET fecha_inicio = :fecha_inicio,
           id_servicio = :id_servicio
       WHERE id_garantia = :id`,
      [fecha_inicio, id_servicio, id]
    );
    res.json({ message: 'Garantía actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar garantía
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(
      'DELETE FROM Garantia WHERE id_garantia = :id',
      [id]
    );
    res.json({ message: 'Garantía eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};