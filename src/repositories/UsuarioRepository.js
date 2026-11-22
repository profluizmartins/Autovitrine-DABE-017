const { lerDados, salvarDados } = require('./jsonStorage');

class UsuarioRepository {
  buscarPorEmail(email) {
    const db = lerDados();
    return db.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  buscarPorId(id) {
    const db = lerDados();
    return db.usuarios.find(u => u.id === Number(id)) || null;
  }

  criar(usuario) {
    const db = lerDados();
    const novoId = db.usuarios.length > 0 ? Math.max(...db.usuarios.map(u => u.id)) + 1 : 1;
    const novo = { id: novoId, ...usuario };
    db.usuarios.push(novo);
    salvarDados(db);
    return novo;
  }
}

module.exports = new UsuarioRepository();