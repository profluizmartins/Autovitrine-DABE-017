const { lerDados, salvarDados } = require('./jsonStorage');

class UsuarioRepositoryJson {
  async buscarPorEmail(email) {
    const db = lerDados();
    return db.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async buscarPorId(id) {
    const db = lerDados();
    return db.usuarios.find(u => u.id === Number(id)) || null;
  }

  async criar({ nome, email, senhaHash, role }) {
    const db = lerDados();
    const novoId = db.usuarios.length > 0 ? Math.max(...db.usuarios.map(u => u.id)) + 1 : 1;
    const novo = { id: novoId, nome, email, senhaHash, role };
    db.usuarios.push(novo);
    salvarDados(db);
    return { id: novo.id, nome: novo.nome, email: novo.email, role: novo.role };
  }
}

module.exports = new UsuarioRepositoryJson();