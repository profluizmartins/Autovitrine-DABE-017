const repository = require('../repositories/CarroRepository');

class CarroService {
  listarTodos(marca) {
    return repository.listar(marca);
  }

  buscarPorId(id) {
    if (isNaN(Number(id))) {
      throw { status: 400, mensagem: 'O ID do veículo deve ser numérico.' };
    }
    const carro = repository.buscarPorId(id);
    if (!carro) {
      throw { status: 404, mensagem: 'Anúncio de veículo não encontrado.' };
    }
    return carro;
  }

  async criar(dados, usuarioLogado) {
    const { marca, modelo, ano, preco, cor, descricao, imagem } = dados;

    if (!marca || !marca.trim() || !modelo || !modelo.trim() || !ano || !preco) {
      throw { status: 422, mensagem: 'Campos obrigatórios: marca, modelo, ano e preco.' };
    }

    if (Number(ano) < 1900 || Number(ano) > 2027 || Number(preco) <= 0) {
      throw { status: 422, mensagem: 'Ano ou preço inválido.' };
    }

    return await repository.criar({
      marca: marca.trim(),
      modelo: modelo.trim(),
      ano: Number(ano),
      preco: Number(preco),
      cor: cor ? cor.trim() : 'Não informada',
      descricao: descricao ? descricao.trim() : '',
      imagem: imagem && imagem.trim()
        ? imagem.trim()
        : 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
      vendedorId: Number(usuarioLogado.sub)
    });
  }

  async atualizar(id, dados, usuarioLogado) {
    const carroExistente = await this.buscarPorId(id);

    const ehAdmin = usuarioLogado.role === 'ADMIN';
    const ehDono = Number(carroExistente.vendedorId) === Number(usuarioLogado.sub);

    if (!ehAdmin && !ehDono) {
      throw { status: 403, mensagem: 'Acesso proibido: você só pode editar seus próprios anúncios.' };
    }

    const { marca, modelo, ano, preco, cor, descricao, imagem } = dados;
    if (!marca || !marca.trim() || !modelo || !modelo.trim() || !ano || !preco) {
      throw { status: 422, mensagem: 'Campos obrigatórios: marca, modelo, ano e preco.' };
    }

    return await repository.atualizar(id, {
      marca: marca.trim(),
      modelo: modelo.trim(),
      ano: Number(ano),
      preco: Number(preco),
      cor: cor ? cor.trim() : carroExistente.cor,
      descricao: descricao !== undefined ? descricao.trim() : carroExistente.descricao,
      imagem: imagem && imagem.trim() ? imagem.trim() : carroExistente.imagem
    });
  }

  remover(id) {
    this.buscarPorId(id); // Garante 404 se não existir
    repository.remover(id);
  }
}

module.exports = new CarroService();
