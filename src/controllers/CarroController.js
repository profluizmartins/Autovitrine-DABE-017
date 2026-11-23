const carroService = require('../services/CarroService');

class CarroController {
  async listar(req, res, next) {
    try {
      console.log("passou aui");
      const { marca } = req.query;
      const lista = await carroService.listarTodos(marca);
      return res.status(200).json(lista);
    } catch (err) {
      next(err);
    }
  }

  async buscarUm(req, res, next) {
    try {
      const carro = await carroService.buscarPorId(req.params.id);
      return res.status(200).json(carro);
    } catch (err) {
      next(err);
    }
  }

  async criar(req, res, next) {
    try {
      const criado = await carroService.criar(req.body, req.usuario);
      return res.status(201).json(criado);
    } catch (err) {
      next(err);
    }
  }

  async atualizar(req, res, next) {
    try {
      const atualizado = await carroService.atualizar(req.params.id, req.body, req.usuario);
      return res.status(200).json(atualizado);
    } catch (err) {
      next(err);
    }
  }

  async deletar(req, res, next) {
    try {
      await carroService.remover(req.params.id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CarroController();