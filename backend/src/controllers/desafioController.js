const desafioService = require('../services/desafioService');
const { desafioParaResposta } = require('../mappers/desafioMapper');

async function criar(req, res, next) {
  try {
    const desafio = await desafioService.criarDesafio(req.body, req.usuario.id_usuario);
    res.status(201).json(desafioParaResposta(desafio));
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const desafios = await desafioService.listarDesafios();
    res.json(desafios.map(desafioParaResposta));
  } catch (err) {
    next(err);
  }
}

async function listarMeus(req, res, next) {
  try {
    const desafios = await desafioService.listarDesafiosDoUsuario(req.usuario.id_usuario);
    res.json(desafios.map(desafioParaResposta));
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const desafio = await desafioService.buscarDesafioPorId(req.params.id);
    res.json(desafioParaResposta(desafio));
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const desafio = await desafioService.atualizarDesafio(req.params.id, req.usuario.id_usuario, req.body);
    res.json(desafioParaResposta(desafio));
  } catch (err) {
    next(err);
  }
}

async function deletar(req, res, next) {
  try {
    await desafioService.deletarDesafio(req.params.id, req.usuario.id_usuario);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function ranking(req, res, next) {
  try {
    const ranking = await desafioService.buscarRanking(req.params.id);
    res.json(ranking);
  } catch (err) {
    next(err);
  }
}

async function buscarPorConvite(req, res, next) {
  try {
    const desafio = await desafioService.buscarPorCodigoConvite(req.params.codigo);
    res.json(desafioParaResposta(desafio));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  criar,
  listar,
  listarMeus,
  buscarPorId,
  atualizar,
  deletar,
  ranking,
  buscarPorConvite,
};
