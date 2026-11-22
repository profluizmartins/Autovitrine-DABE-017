const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_jwt_autovitrine_2026';

// AuthN: Valida Token JWT no cabeçalho Authorization: Bearer <token>
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Não autenticado: Token JWT não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, usuarioDecodificado) => {
    if (err) {
      return res.status(401).json({ erro: 'Não autenticado: Token inválido ou expirado.' });
    }
    req.usuario = usuarioDecodificado;
    next();
  });
}

// AuthZ (RBAC): Restringe acesso por perfil (role)
function exigirRole(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidas.includes(req.usuario.role)) {
      return res.status(403).json({
        erro: `Acesso proibido (403): Perfil exigido [${rolesPermitidas.join(', ')}].`
      });
    }
    next();
  };
}

module.exports = { autenticarToken, exigirRole };
