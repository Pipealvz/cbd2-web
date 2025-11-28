const jwt = require('jsonwebtoken');

function verifyTokenMiddleware(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Token requerido' });
    }

    const tokenClean = token.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(tokenClean, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

module.exports = { verifyTokenMiddleware };
