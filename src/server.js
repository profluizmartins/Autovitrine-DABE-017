const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const apiRoutes = require('./routes/apiRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS e JSON Body Parser
app.use(cors());
app.use(express.json());

// 2. Front-End estático
app.use(express.static(path.join(__dirname, '../public')));

// 3. Documentação Interativa OpenAPI / Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs/api.json', (req, res) => res.json(swaggerSpec));

// 4. Healthcheck endpoint
app.get('/health-quebrado', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'AutoVitrine API', timestamp: new Date().toISOString() });
});

// 5. Rotas Versionadas da API (/api/v1)
app.use('/api/v1', apiRoutes);

// 6. Middleware Global de Tratamento de Erros
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Front-End:  http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/docs`);
  console.log(`OpenAPI:    http://localhost:${PORT}/docs/api.json`);
});
