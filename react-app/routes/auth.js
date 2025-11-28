const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db-oracle');
const oracledb = require('oracledb');
const cors = require('cors');

router.use(cors());

router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  let connection;
  try {
    connection = await db.getConnection();

    const result = await connection.execute(
      `SELECT id_persona, correo, contrasena 
       FROM persona
       WHERE correo = :correo`,
      { correo },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas (correo)' });
    }

    const persona = result.rows[0];
    const id_persona = persona.ID_PERSONA;
    const correoDB = persona.CORREO;
    const contrasenaDB = persona.CONTRASENA;

    if (contrasena !== contrasenaDB) {
      return res.status(401).json({ error: 'Credenciales inválidas (contraseña)' });
    }

    const token = jwt.sign(
      { id_persona, correo: correoDB },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      ok: true,
      token
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });

  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
