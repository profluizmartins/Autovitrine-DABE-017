const carroService = require('../services/CarroService');

class CarroController {
  listar(req, res, next) {
    try {
      const { marca } = req.query;
      const lista = carroService.listarTodos(marca);
      return res.status(200).json(lista);
    } catch (err) {
      next(err);
    }
  }

  buscarUm(req, res, next) {
    try {
      const carro = carroService.buscarPorId(req.params.id);
      return res.status(200).json(carro);
    } catch (err) {
      next(err);
    }
  }

  criar(req, res, next) {
    try {
      const criado = carroService.criar(req.body, req.usuario);
      return res.status(201).json(criado);
    } catch (err) {
      next(err);
    }
  }

  atualizar(req, res, next) {
    try {
      const atualizado = carroService.atualizar(req.params.id, req.body, req.usuario);
      return res.status(200).json(atualizado);
    } catch (err) {
      next(err);
    }
  }

  deletar(req, res, next) {
    try {
      carroService.remover(req.params.id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CarroController();
