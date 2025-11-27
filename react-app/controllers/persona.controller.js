const db = require('../config/db-oracle');


// Obtener todas las personas
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(
      `SELECT * FROM US_PPI.Persona`,
      [],
      { outFormat: db.OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener persona por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute(
      `SELECT * FROM Persona WHERE id_persona = :id`,
      { id },
      { outFormat: db.OBJECT }
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva persona
exports.create = async (req, res) => {
  try {
    const body = req.body;

    await db.execute(
      `INSERT INTO Persona (
        id_persona, nombre, primer_apellido, segundo_apellido,
        correo, telefono, id_perfil
      ) VALUES (
        :id_persona, :nombre, :primer_apellido, :segundo_apellido,
        :correo, :telefono, :id_perfil
      )`,
      body,
      { autoCommit: true }  // 👈 necesario en Oracle
    );

    res.status(201).json({ message: 'Persona creada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar persona
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    await db.execute(
      `UPDATE Persona
       SET nombre = :nombre,
           primer_apellido = :primer_apellido,
           segundo_apellido = :segundo_apellido,
           correo = :correo,
           telefono = :telefono,
           id_perfil = :id_perfil
       WHERE id_persona = :id`,
      {
        ...body,
        id
      },
      { autoCommit: true } // 👈 commit automático
    );

    res.json({ message: 'Persona actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar persona
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM Persona WHERE id_persona = :id`,
      { id },
      { autoCommit: true } // 👈 commit
    );

    res.json({ message: 'Persona eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
