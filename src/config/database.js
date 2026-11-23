const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function inicializarBanco() {
  const totalUsuarios = await prisma.usuario.count();

  if (totalUsuarios === 0) {
    const adminHash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('123456', 10);

    const admin = await prisma.usuario.create({
      data: {
        nome: 'Administrador Concessionária',
        email: 'admin@auto.com',
        senhaHash: adminHash,
        role: 'ADMIN'
      }
    });

    const vendedor = await prisma.usuario.create({
      data: {
        nome: 'Vendedor Padrão',
        email: 'vendedor@auto.com',
        senhaHash: userHash,
        role: 'USER'
      }
    });

    await prisma.carro.createMany({
      data: [
        {
          marca: 'Toyota',
          modelo: 'Corolla XEi 2.0',
          ano: 2023,
          preco: 138900,
          cor: 'Prata',
          descricao: 'Único dono, revisões em concessionária, baixa quilometragem.',
          imagem: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
          vendedorId: vendedor.id
        },
        {
          marca: 'Honda',
          modelo: 'Civic Touring 1.5 Turbo',
          ano: 2022,
          preco: 152000,
          cor: 'Preto',
          descricao: 'Teto solar, painel digital, impecável.',
          imagem: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
          vendedorId: admin.id
        }
      ]
    });

    console.log('Seed inicial via Prisma ORM concluído com sucesso.');
  }
}

module.exports = { prisma, inicializarBanco };