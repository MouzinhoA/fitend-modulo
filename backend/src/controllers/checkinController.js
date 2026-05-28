const checkinService = require('../services/checkinService');
const { checkinParaResposta } = require('../mappers/checkinMapper');

async function criar(req, res, next) {
  try {
    const checkin = await checkinService.criarCheckin(
      req.body,
      req.params.participacaoId,
    );
    res.status(201).json(checkinParaResposta(checkin));
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const checkins = await checkinService.listarCheckins(req.params.participacaoId);
    res.json(checkins.map(checkinParaResposta));
  } catch (err) {
    next(err);
  }
}

async function listarDoDesafio(req, res, next) {
  try {
    const checkins = await checkinService.listarCheckinsDoDesafio(req.params.desafioId);
    res.json(checkins.map(c => ({
      ...checkinParaResposta(c),
      usuario: c.participacao.usuario ? {
        id_usuario: c.participacao.usuario.id_usuario,
        nome: c.participacao.usuario.nome,
      } : undefined,
    })));
  } catch (err) {
    next(err);
  }
}

module.exports = { criar, listar, listarDoDesafio };
