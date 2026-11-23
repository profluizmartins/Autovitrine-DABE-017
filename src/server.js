const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const apiRoutes = require('./routes/apiRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const provider = (process.env.DB_PROVIDER || 'json').toLowerCase();
const { prisma, inicializarBanco } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 2. Documentação OpenAPI / Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs/api.json', (req, res) => res.json(swaggerSpec));

// 3. Healthcheck dinâmico (JSON ou PostgreSQL)
app.get('/health', async (req, res) => {
  if (provider === 'postgres') {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return res.status(200).json({
        status: 'UP',
        storage: 'POSTGRESQL (Prisma ORM)',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      return res.status(503).json({
        status: 'DOWN',
        storage: 'POSTGRESQL',
        erro: err.message
      });
    }
  }

  return res.status(200).json({
    status: 'UP',
    storage: 'JSON_FILE (data/database.json)',
    timestamp: new Date().toISOString()
  });
});

// 4. Rotas Versionadas da API
app.use('/api/v2', apiRoutes);

// 5. Middleware Global de Tratamento de Erros
app.use(errorHandler);

// 6. Inicialização do Servidor
async function bootstrap() {
  if (provider === 'postgres') {
    await inicializarBanco();
  }

  app.listen(PORT, () => {
    console.log(`Persistência ativa: ${provider.toUpperCase()}`);
    console.log(`Front-End:          http://localhost:${PORT}`);
    console.log(`Swagger UI:         http://localhost:${PORT}/docs`);
    console.log(`Health Check:       http://localhost:${PORT}/health`);
  });
}

bootstrap().catch(err => {
  console.error('Falha crítica ao iniciar o servidor:', err);
  process.exit(1);
});