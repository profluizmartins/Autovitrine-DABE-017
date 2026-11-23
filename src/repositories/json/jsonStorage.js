const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../../../data/database.json');

function inicializarBanco() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const dadosIniciais = {
      usuarios: [
        {
          id: 1,
          nome: 'Administrador Concessionária',
          email: 'admin@auto.com',
          senhaHash: bcrypt.hashSync('admin123', 10),
          role: 'ADMIN'
        },
        {
          id: 2,
          nome: 'Vendedor Padrão',
          email: 'vendedor@auto.com',
          senhaHash: bcrypt.hashSync('123456', 10),
          role: 'USER'
        }
      ],
      carros: [
        {
          id: 1,
          marca: 'Toyota',
          modelo: 'Corolla XEi 2.0',
          ano: 2023,
          preco: 138900,
          cor: 'Prata',
          descricao: 'Único dono, revisões em concessionária, baixa quilometragem.',
          imagem: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
          vendedorId: 2,
          vendedorNome: 'Vendedor Padrão',
          criadoEm: new Date().toISOString()
        },
        {
          id: 2,
          marca: 'Honda',
          modelo: 'Civic Touring 1.5 Turbo',
          ano: 2022,
          preco: 152000,
          cor: 'Preto',
          descricao: 'Teto solar, painel digital, impecável.',
          imagem: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
          vendedorId: 1,
          vendedorNome: 'Administrador Concessionária',
          criadoEm: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(dadosIniciais, null, 2), 'utf-8');
  }
}

function lerDados() {
  inicializarBanco();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function salvarDados(dados) {
  fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2), 'utf-8');
}

module.exports = { lerDados, salvarDados };