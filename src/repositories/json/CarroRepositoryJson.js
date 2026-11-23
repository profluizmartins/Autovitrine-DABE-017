const { lerDados, salvarDados } = require('./jsonStorage');

class CarroRepositoryJson {
  async listar(marcaFiltro) {
    const db = lerDados();
    const lista = marcaFiltro
      ? db.carros.filter(c => c.marca.toLowerCase().includes(marcaFiltro.toLowerCase()))
      : db.carros;

    return lista.map(c => {
      const vendedor = db.usuarios.find(u => u.id === c.vendedorId);
      return { ...c, vendedorNome: vendedor ? vendedor.nome : (c.vendedorNome || 'Vendedor') };
    });
  }

  async buscarPorId(id) {
    const db = lerDados();
    const carro = db.carros.find(c => c.id === Number(id));
    if (!carro) return null;
    const vendedor = db.usuarios.find(u => u.id === carro.vendedorId);
    return { ...carro, vendedorNome: vendedor ? vendedor.nome : (carro.vendedorNome || 'Vendedor') };
  }

  async criar(dadosCarro) {
    const db = lerDados();
    const novoId = db.carros.length > 0 ? Math.max(...db.carros.map(c => c.id)) + 1 : 1;
    const novo = { id: novoId, ...dadosCarro, criadoEm: new Date().toISOString() };
    db.carros.push(novo);
    salvarDados(db);
    return this.buscarPorId(novoId);
  }

  async atualizar(id, dadosAtualizados) {
    const db = lerDados();
    const idx = db.carros.findIndex(c => c.id === Number(id));
    if (idx === -1) return null;
    db.carros[idx] = { ...db.carros[idx], ...dadosAtualizados, atualizadoEm: new Date().toISOString() };
    salvarDados(db);
    return this.buscarPorId(id);
  }

  async remover(id) {
    const db = lerDados();
    const idx = db.carros.findIndex(c => c.id === Number(id));
    if (idx === -1) return false;
    db.carros.splice(idx, 1);
    salvarDados(db);
    return true;
  }
}

module.exports = new CarroRepositoryJson();