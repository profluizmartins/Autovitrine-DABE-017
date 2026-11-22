const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const repository = require('../repositories/AutoRepository');
const usuarioRepository = require('../repositories/UsuarioRepository');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_jwt_autovitrine_2026';
const SALT_ROUNDS = 10;

class AuthService {
  async registrar({ nome, email, senha, role }) {
    if (!nome || !nome.trim() || !email || !email.trim() || !senha || senha.length < 4) {
      throw { status: 422, mensagem: 'Nome, e-mail válido e senha (mínimo 4 caracteres) são obrigatórios.' };
    }

    // Validação de formato de e-mail
    const emailLimpo = email.trim().toLowerCase();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(emailLimpo)) {
      throw { status: 422, mensagem: 'Formato de e-mail inválido. Utilize o padrão usuario@dominio.com.' };
    }

    const existente = usuarioRepository.buscarPorEmail(emailLimpo);
    if (existente) {
      throw { status: 409, mensagem: 'Este e-mail já está cadastrado.' };
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    const perfilDefinido = role && role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';

    const criado = usuarioRepository.criar({
      nome: nome.trim(),
      email: emailLimpo,
      senhaHash,
      role: perfilDefinido
    });

    return {
      id: criado.id,
      nome: criado.nome,
      email: criado.email,
      role: criado.role
    };
  }

  async login({ email, senha }) {
    if (!email || !senha) {
      throw { status: 400, mensagem: 'E-mail e senha são obrigatórios.' };
    }

    const usuario = usuarioRepository.buscarPorEmail(email.trim());
    if (!usuario) {
      throw { status: 401, mensagem: 'Credenciais inválidas.' };
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaConfere) {
      throw { status: 401, mensagem: 'Credenciais inválidas.' };
    }

    const payload = {
      sub: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    };
  }
}

module.exports = new AuthService();
