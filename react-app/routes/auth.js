const express = require('express');
const router = express.Router();
const db = require('../config/db-oracle'); // tu conexión Oracle
const jwt = require('jsonwebtoken');
const cors = require('cors');

router.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'esto_es_una_clave_secreta_muy_segura';

router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  let connection;
  try {
    connection = await db.getConnection();

    // Consulta con formato objeto
    const result = await connection.execute(
      `SELECT id_persona, correo, contrasena 
       FROM persona
       WHERE correo = :correo`,
      { correo },
      { outFormat: db.OUT_FORMAT_OBJECT }
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas (correo)' });
    }

    const persona = result.rows[0];

    if (contrasena !== persona.CONTRASENA) {
      return res.status(401).json({ error: 'Credenciales inválidas (contraseña)' });
    }

    // Firmar JWT
    const token = jwt.sign(
      { id_persona: persona.ID_PERSONA, correo: persona.CORREO },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      ok: true,
      token,
      user: {
        id_persona: persona.ID_PERSONA,
        correo: persona.CORREO
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
