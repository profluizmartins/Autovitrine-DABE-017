const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AutoVitrine API — Classificados de Veículos',
      version: '1.0.0',
      description: 'API RESTful estruturada em Clean Architecture com BCrypt, JWT, RBAC e persistência em arquivo.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local / Contêiner Docker'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        UsuarioRegisterDTO: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'Carlos Souza' },
            email: { type: 'string', example: 'carlos@auto.com' },
            senha: { type: 'string', example: '123456' },
            role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' }
          }
        },
        UsuarioLoginDTO: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', example: 'admin@auto.com' },
            senha: { type: 'string', example: 'admin123' }
          }
        },
        CarroDTO: {
          type: 'object',
          required: ['marca', 'modelo', 'ano', 'preco'],
          properties: {
            marca: { type: 'string', example: 'Volkswagen' },
            modelo: { type: 'string', example: 'Golf GTI' },
            ano: { type: 'integer', example: 2023 },
            preco: { type: 'number', example: 145000 },
            cor: { type: 'string', example: 'Branco' },
            descricao: { type: 'string', example: 'Único dono, todas as revisões feitas.' },
            imagem: { type: 'string', example: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80' }
          }
        },
        CarroResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            marca: { type: 'string', example: 'Toyota' },
            modelo: { type: 'string', example: 'Corolla XEi 2.0' },
            ano: { type: 'integer', example: 2023 },
            preco: { type: 'number', example: 138900 },
            cor: { type: 'string', example: 'Prata' },
            descricao: { type: 'string', example: 'Único dono.' },
            vendedorNome: { type: 'string', example: 'Vendedor Padrão' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
