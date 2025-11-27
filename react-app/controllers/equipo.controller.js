const db = require('../config/db-oracle');

// Obtener todos los equipos
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM Equipo`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener equipo por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute(
      `SELECT * FROM Equipo WHERE id_equipo = :id`,
      [id]
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo equipo
exports.create = async (req, res) => {
  try {
    const {
      id_equipo,
      tipo_eq,
      marca_eq,
      id_persona,
      especificaciones,
      equipo_serial
    } = req.body;

    await db.execute(
      `INSERT INTO Equipo (
        id_equipo,
        tipo_eq,
        marca_eq,
        id_persona,
        especificaciones,
        equipo_serial
      ) VALUES (
        :id_equipo,
        :tipo_eq,
        :marca_eq,
        :id_persona,
        :especificaciones,
        :equipo_serial
      )`,
      [
        id_equipo,
        tipo_eq,
        marca_eq,
        id_persona,
        especificaciones,
        equipo_serial
      ]
    );

    res.status(201).json({ message: 'Equipo creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar equipo
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tipo_eq,
      marca_eq,
      id_persona,
      especificaciones,
      equipo_serial
    } = req.body;

    await db.execute(
      `UPDATE Equipo
       SET tipo_eq = :tipo_eq,
           marca_eq = :marca_eq,
           id_persona = :id_persona,
           especificaciones = :especificaciones,
           equipo_serial = :equipo_serial
       WHERE id_equipo = :id`,
      [
        tipo_eq,
        marca_eq,
        id_persona,
        especificaciones,
        equipo_serial,
        id
      ]
    );

    res.json({ message: 'Equipo actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar equipo
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM Equipo WHERE id_equipo = :id`,
      [id]
    );

    res.json({ message: 'Equipo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
