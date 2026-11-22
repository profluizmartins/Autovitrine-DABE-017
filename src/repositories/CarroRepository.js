const { lerDados, salvarDados } = require('./jsonStorage');

class CarroRepository {
  listar(marcaFiltro) {
    const db = lerDados();
    if (marcaFiltro) {
      return db.carros.filter(c => c.marca.toLowerCase().includes(marcaFiltro.toLowerCase()));
    }
    return db.carros;
  }

  buscarPorId(id) {
    const db = lerDados();
    return db.carros.find(c => c.id === Number(id)) || null;
  }

  criar(dadosCarro) {
    const db = lerDados();
    const novoId = db.carros.length > 0 ? Math.max(...db.carros.map(c => c.id)) + 1 : 1;
    const novo = { id: novoId, ...dadosCarro, criadoEm: new Date().toISOString() };
    db.carros.push(novo);
    salvarDados(db);
    return novo;
  }

  atualizar(id, dadosAtualizados) {
    const db = lerDados();
    const idx = db.carros.findIndex(c => c.id === Number(id));
    if (idx === -1) return null;
    db.carros[idx] = { ...db.carros[idx], ...dadosAtualizados, atualizadoEm: new Date().toISOString() };
    salvarDados(db);
    return db.carros[idx];
  }

  remover(id) {
    const db = lerDados();
    const idx = db.carros.findIndex(c => c.id === Number(id));
    if (idx === -1) return false;
    db.carros.splice(idx, 1);
    salvarDados(db);
    return true;
  }
}

module.exports = new CarroRepository();