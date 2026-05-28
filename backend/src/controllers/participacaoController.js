const participacaoService = require('../services/participacaoService');
const { participacaoParaResposta } = require('../mappers/participacaoMapper');

async function participar(req, res, next) {
  try {
    const participacao = await participacaoService.participar(
      req.usuario.id_usuario,
      req.body.cod_convite,
    );
    res.status(201).json(participacaoParaResposta(participacao));
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const participacoes = await participacaoService.listarParticipacoes(req.usuario.id_usuario);
    res.json(participacoes.map(participacaoParaResposta));
  } catch (err) {
    next(err);
  }
}

async function sair(req, res, next) {
  try {
    await participacaoService.sairDoDesafio(req.params.id, req.usuario.id_usuario);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { participar, listar, sair };
