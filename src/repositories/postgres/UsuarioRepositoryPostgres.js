const { prisma } = require('../../config/database');

class UsuarioRepositoryPostgres {
  async buscarPorEmail(email) {
    return await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });
  }

  async buscarPorId(id) {
    return await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true
      }
    });
  }

  async criar({ nome, email, senhaHash, role }) {
    return await prisma.usuario.create({
      data: {
        nome,
        email: email.toLowerCase(),
        senhaHash,
        role
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true
      }
    });
  }
}

module.exports = new UsuarioRepositoryPostgres();