const authService = require('../services/AuthService');

class AuthController {
  async register(req, res, next) {
    try {
      const usuario = await authService.registrar(req.body);
      return res.status(201).json({
        mensagem: 'Usuário foi cadastrado com sucesso.',
        usuario
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const resultado = await authService.login(req.body);
      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
