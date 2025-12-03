const db = require('../config/db-oracle');

// ======================================================
// OBTENER TODAS LAS PERSONAS
// ======================================================
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM Persona`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================================================
// OBTENER PERSONA POR ID
// ======================================================
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute(
      `SELECT * FROM Persona WHERE id_persona = :id`,
      { id }
    );

    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================================================
// OBTENER PERSONA DEL TOKEN (si aplica)
// ======================================================
exports.getByUser = async (req, res) => {
  try {
    const userId = req.user?.id_persona;
    if (!userId)
      return res.status(401).json({ error: 'Usuario no autenticado' });

    const result = await db.execute(
      `SELECT * FROM Persona WHERE id_persona = :id`,
      { id: userId }
    );

    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================================================
// CREAR PERSONA
// ======================================================
exports.create = async (req, res) => {
  try {
    let {
      id_persona,
      nombre,
      primer_apellido,
      segundo_apellido,
      correo,
      telefono,
      id_perfil,
      contrasena,
      fecha_nacimiento
    } = req.body;

    // Normalizar fecha ISO → Oracle DATE
    if (fecha_nacimiento) {
      fecha_nacimiento = fecha_nacimiento.replace("Z", "").split(".")[0];
    }

    const sql = `
      INSERT INTO Persona (
        id_persona, nombre, primer_apellido, segundo_apellido, correo,
        telefono, id_perfil, contrasena,
        fecha_nacimiento
      )
      VALUES (
        :id_persona, :nombre, :primer_apellido, :segundo_apellido, :correo,
        :telefono, :id_perfil, :contrasena,
        ${fecha_nacimiento ? "TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD\"T\"HH24:MI:SS')" : "NULL"}
      )
    `;

    await db.execute(
      sql,
      {
        id_persona,
        nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        telefono,
        id_perfil,
        contrasena,
        fecha_nacimiento
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Persona creada correctamente' });
  } catch (err) {
    if (err.errorNum === "20010") {
      return res.status(400).json({
        ok: false,
        message: err.message
      });
    } else if (err.errorNum === "00001") {
      return res.status(400).json({
        ok: false,
        message: err.message
      });
    }
    console.error('Error inesperado. Por favor contactar con equipo técnico.', err);
    res.status(500).json({ error: err.message });
  }
};

// ======================================================
// ACTUALIZAR PERSONA
// ======================================================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      nombre,
      primer_apellido,
      segundo_apellido,
      correo,
      telefono,
      id_perfil,
      contrasena,
      fecha_nacimiento
    } = req.body;

    if (fecha_nacimiento) {
      fecha_nacimiento = fecha_nacimiento.replace("Z", "").split(".")[0];
    }

    const sql = `
      UPDATE Persona SET
        nombre = :nombre,
        primer_apellido = :primer_apellido,
        segundo_apellido = :segundo_apellido,
        correo = :correo,
        telefono = :telefono,
        id_perfil = :id_perfil,
        contrasena = :contrasena,
        fecha_nacimiento = ${fecha_nacimiento ? "TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD\"T\"HH24:MI:SS')" : "NULL"}
      WHERE id_persona = :id
    `;

    await db.execute(
      sql,
      {
        nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        telefono,
        id_perfil,
        contrasena,
        fecha_nacimiento,
        id
      },
      { autoCommit: true }
    );

    res.json({ message: 'Persona actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================================================
// ELIMINAR PERSONA
// ======================================================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM Persona WHERE id_persona = :id`,
      { id },
      { autoCommit: true }
    );

    res.json({ message: 'Persona eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
