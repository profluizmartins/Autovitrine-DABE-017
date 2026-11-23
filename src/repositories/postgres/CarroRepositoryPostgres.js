const { prisma } = require('../../config/database');

function formatarCarro(carro) {
  if (!carro) return null;
  const { vendedor, ...dados } = carro;
  return {
    ...dados,
    vendedorNome: vendedor?.nome || 'Vendedor'
  };
}

class CarroRepositoryPostgres {
  async listar(marcaFiltro) {
    const lista = await prisma.carro.findMany({
      where: marcaFiltro
        ? { marca: { contains: marcaFiltro, mode: 'insensitive' } }
        : undefined,
      include: { vendedor: { select: { nome: true } } },
      orderBy: { id: 'asc' }
    });
    return lista.map(formatarCarro);
  }

  async buscarPorId(id) {
    const carro = await prisma.carro.findUnique({
      where: { id: Number(id) },
      include: { vendedor: { select: { nome: true } } }
    });
    return formatarCarro(carro);
  }

  async criar({ marca, modelo, ano, preco, cor, descricao, imagem, vendedorId }) {
    const criado = await prisma.carro.create({
      data: {
        marca,
        modelo,
        ano: Number(ano),
        preco: Number(preco),
        cor,
        descricao,
        imagem,
        vendedorId: vendedorId ? Number(vendedorId) : null
      },
      include: { vendedor: { select: { nome: true } } }
    });
    return formatarCarro(criado);
  }

  async atualizar(id, { marca, modelo, ano, preco, cor, descricao, imagem }) {
    const atualizado = await prisma.carro.update({
      where: { id: Number(id) },
      data: {
        marca,
        modelo,
        ano: Number(ano),
        preco: Number(preco),
        cor,
        descricao,
        imagem
      },
      include: { vendedor: { select: { nome: true } } }
    });
    return formatarCarro(atualizado);
  }

  async remover(id) {
    await prisma.carro.delete({ where: { id: Number(id) } });
    return true;
  }
}

module.exports = new CarroRepositoryPostgres();