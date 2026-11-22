function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const mensagem = err.mensagem || err.message || 'Erro interno no servidor.';

  return res.status(status).json({
    status,
    erro: mensagem,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;
