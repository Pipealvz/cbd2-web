const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esto_por_una_secreta_muy_segura';

function verifyTokenMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token proporcionado' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id_persona: decoded.id_persona, correo: decoded.correo };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { verifyTokenMiddleware };
