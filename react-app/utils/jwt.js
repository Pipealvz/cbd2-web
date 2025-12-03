const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esto_por_una_secreta_muy_segura';
const DEFAULT_EXPIRES = process.env.JWT_EXPIRES || '8h';

/**
 * signToken(payload, options)
 * - payload: objeto con claims (ej. { sub, correo })
 * - devuelve token firmado
 */
function signToken(payload = {}, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: options.expiresIn || DEFAULT_EXPIRES });
}

module.exports = { signToken };