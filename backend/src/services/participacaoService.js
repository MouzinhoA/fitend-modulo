const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function participar(usuarioId, codigoConvite) {
  const desafio = await prisma.desafio.findUnique({
    where: { cod_convite: codigoConvite },
  });

  if (!desafio) {
    const err = new Error('Código de convite inválido');
    err.statusCode = 404;
    throw err;
  }

  if (desafio.status !== 'Ativo' && desafio.status !== 'Pendente') {
    const err = new Error('Desafio não está aberto para participação');
    err.statusCode = 400;
    throw err;
  }

  if (desafio.criador_id === usuarioId) {
    const err = new Error('Você é o criador deste desafio');
    err.statusCode = 400;
    throw err;
  }

  const existente = await prisma.participacao.findUnique({
    where: {
      usuario_id_desafio_id: {
        usuario_id: usuarioId,
        desafio_id: desafio.id_desafio,
      },
    },
  });

  if (existente) {
    const err = new Error('Você já participa deste desafio');
    err.statusCode = 409;
    throw err;
  }

  const participacao = await prisma.participacao.create({
    data: {
      usuario_id: usuarioId,
      desafio_id: desafio.id_desafio,
    },
    include: {
      usuario: true,
      desafio: true,
    },
  });

  return participacao;
}

async function listarParticipacoes(usuarioId) {
  return prisma.participacao.findMany({
    where: { usuario_id: usuarioId },
    include: {
      desafio: {
        include: {
          metrica: true,
          criador: true,
        },
      },
    },
  });
}

async function sairDoDesafio(participacaoId, usuarioId) {
  const participacao = await prisma.participacao.findUnique({
    where: { id_participante: participacaoId },
    include: { desafio: true },
  });

  if (!participacao) {
    const err = new Error('Participação não encontrada');
    err.statusCode = 404;
    throw err;
  }

  if (participacao.usuario_id !== usuarioId) {
    const err = new Error('Você não pode remover esta participação');
    err.statusCode = 403;
    throw err;
  }

  if (participacao.desafio.status !== 'Ativo' && participacao.desafio.status !== 'Pendente') {
    const err = new Error('Não é possível sair de um desafio encerrado');
    err.statusCode = 400;
    throw err;
  }

  await prisma.checkin.deleteMany({
    where: { participacao_id: participacaoId },
  });

  await prisma.participacao.delete({
    where: { id_participante: participacaoId },
  });
}

async function recalcularProgresso(participacaoId) {
  const result = await prisma.checkin.aggregate({
    where: { participacao_id: participacaoId },
    _sum: { valor_registrado: true },
  });

  const total = result._sum.valor_registrado || 0;

  await prisma.participacao.update({
    where: { id_participante: participacaoId },
    data: { progresso_total: total },
  });
}

module.exports = {
  participar,
  listarParticipacoes,
  sairDoDesafio,
  recalcularProgresso,
};
