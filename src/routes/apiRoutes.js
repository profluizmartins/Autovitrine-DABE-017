const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');
const carroController = require('../controllers/CarroController');
const { autenticarToken, exigirRole } = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Cadastrar novo usuário (USER ou ADMIN)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioRegisterDTO'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       409:
 *         description: E-mail já cadastrado
 *       422:
 *         description: Dados de entrada inválidos
 */
router.post('/auth/register', (req, res, next) => authController.register(req, res, next));

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Autenticar usuário e emitir Token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioLoginDTO'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso (retorna Token JWT)
 *       400:
 *         description: E-mail ou senha ausentes
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/auth/login', (req, res, next) => authController.login(req, res, next));

/**
 * @openapi
 * /api/v1/carros:
 *   get:
 *     summary: Listar todos os anúncios de carros (Público)
 *     tags: [Veículos]
 *     parameters:
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *         description: Filtrar anúncios por marca (opcional)
 *     responses:
 *       200:
 *         description: Lista de veículos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarroResponse'
 */
router.get('/carros', (req, res, next) => carroController.listar(req, res, next));

/**
 * @openapi
 * /api/v1/carros/{id}:
 *   get:
 *     summary: Visualizar detalhes de um anúncio por ID (Público)
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do veículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarroResponse'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Veículo não encontrado
 */
router.get('/carros/:id', (req, res, next) => carroController.buscarUm(req, res, next));

/**
 * @openapi
 * /api/v1/carros:
 *   post:
 *     summary: Publicar novo anúncio de carro (Autenticado - USER ou ADMIN)
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarroDTO'
 *     responses:
 *       201:
 *         description: Anúncio criado com sucesso
 *       401:
 *         description: Token JWT ausente ou inválido
 *       422:
 *         description: Campos obrigatórios inválidos
 */
router.post('/carros', autenticarToken, (req, res, next) => carroController.criar(req, res, next));

/**
 * @openapi
 * /api/v1/carros/{id}:
 *   put:
 *     summary: Alterar anúncio existente (Dono do anúncio ou ADMIN)
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarroDTO'
 *     responses:
 *       200:
 *         description: Anúncio atualizado com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Proibido editar anúncio de outro vendedor
 *       404:
 *         description: Veículo não encontrado
 */
router.put('/carros/:id', autenticarToken, (req, res, next) => carroController.atualizar(req, res, next));

/**
 * @openapi
 * /api/v1/carros/{id}:
 *   delete:
 *     summary: Excluir anúncio de veículo (Exclusivo perfil ADMIN)
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Anúncio removido com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Privilégio de ADMIN exigido para exclusão
 *       404:
 *         description: Veículo não encontrado
 */
router.delete('/carros/:id', autenticarToken, exigirRole('ADMIN'), (req, res, next) => carroController.deletar(req, res, next));

module.exports = router;
