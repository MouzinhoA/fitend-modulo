const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function criarCheckin(data, participacaoId) {
  const participacao = await prisma.participacao.findUnique({
    where: { id_participante: participacaoId },
    include: { desafio: true },
  });

  if (!participacao) {
    const err = new Error('Participação não encontrada');
    err.statusCode = 404;
    throw err;
  }

  if (participacao.desafio.status !== 'Ativo') {
    const err = new Error('O desafio não está ativo');
    err.statusCode = 400;
    throw err;
  }

  const checkin = await prisma.checkin.create({
    data: {
      participacao_id: participacaoId,
      valor_registrado: data.valor_registrado,
      data_hora: data.data_hora ? new Date(data.data_hora) : new Date(),
      foto_url: data.foto_url || null,
    },
  });

  const { recalcularProgresso } = require('./participacaoService');
  await recalcularProgresso(participacaoId);

  return checkin;
}

async function listarCheckins(participacaoId) {
  return prisma.checkin.findMany({
    where: { participacao_id: participacaoId },
    orderBy: { data_hora: 'desc' },
  });
}

async function listarCheckinsDoDesafio(desafioId) {
  return prisma.checkin.findMany({
    where: {
      participacao: { desafio_id: desafioId },
    },
    include: {
      participacao: {
        include: { usuario: true },
      },
    },
    orderBy: { data_hora: 'desc' },
  });
}

async function criarCheckinPorUsuario(usuarioId, desafioId, data) {
  let participacao = await prisma.participacao.findUnique({
    where: {
      usuario_id_desafio_id: {
        usuario_id: usuarioId,
        desafio_id: desafioId,
      },
    },
    include: { desafio: true },
  });

  if (!participacao) {
    participacao = await prisma.participacao.create({
      data: {
        usuario_id: usuarioId,
        desafio_id: desafioId,
      },
      include: { desafio: true },
    });
  }

  if (participacao.desafio.status !== 'Ativo') {
    const err = new Error('O desafio não está ativo');
    err.statusCode = 400;
    throw err;
  }

  const checkin = await prisma.checkin.create({
    data: {
      participacao_id: participacao.id_participante,
      valor_registrado: data.valor_registrado,
      data_hora: data.data_hora ? new Date(data.data_hora) : new Date(),
      foto_url: data.foto_url || null,
    },
  });

  const { recalcularProgresso } = require('./participacaoService');
  await recalcularProgresso(participacao.id_participante);

  return checkin;
}

module.exports = {
  criarCheckin,
  listarCheckins,
  listarCheckinsDoDesafio,
  criarCheckinPorUsuario,
};
