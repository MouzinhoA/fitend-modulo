const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function gerarCodigoConvite() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

async function criarDesafio(data, criadorId) {
  const metrica = await prisma.metrica.findUnique({
    where: { id_metrica: data.metrica_id },
  });

  if (!metrica) {
    const err = new Error('Métrica não encontrada');
    err.statusCode = 404;
    throw err;
  }

  const desafio = await prisma.desafio.create({
    data: {
      titulo: data.titulo,
      descricao: data.descricao,
      data_inicio: new Date(data.data_inicio),
      data_fim: new Date(data.data_fim),
      cod_convite: gerarCodigoConvite(),
      criador_id: criadorId,
      metrica_id: data.metrica_id,
    },
    include: {
      criador: true,
      metrica: true,
    },
  });

  return desafio;
}

async function listarDesafios() {
  return prisma.desafio.findMany({
    include: {
      criador: true,
      metrica: true,
      _count: {
        select: { participacoes: true },
      },
    },
  });
}

async function listarDesafiosDoUsuario(usuarioId) {
  return prisma.desafio.findMany({
    where: {
      OR: [
        { criador_id: usuarioId },
        {
          participacoes: {
            some: { usuario_id: usuarioId },
          },
        },
      ],
    },
    include: {
      criador: true,
      metrica: true,
      _count: {
        select: { participacoes: true },
      },
    },
  });
}

async function buscarDesafioPorId(id) {
  const desafio = await prisma.desafio.findUnique({
    where: { id_desafio: id },
    include: {
      criador: true,
      metrica: true,
      participacoes: {
        include: {
          usuario: true,
          checkins: true,
        },
      },
    },
  });

  if (!desafio) {
    const err = new Error('Desafio não encontrado');
    err.statusCode = 404;
    throw err;
  }

  return desafio;
}

async function atualizarDesafio(id, criadorId, data) {
  const desafio = await prisma.desafio.findUnique({
    where: { id_desafio: id },
  });

  if (!desafio) {
    const err = new Error('Desafio não encontrado');
    err.statusCode = 404;
    throw err;
  }

  if (desafio.criador_id !== criadorId) {
    const err = new Error('Apenas o criador pode alterar o desafio');
    err.statusCode = 403;
    throw err;
  }

  return prisma.desafio.update({
    where: { id_desafio: id },
    data: {
      ...data,
      data_inicio: data.data_inicio ? new Date(data.data_inicio) : undefined,
      data_fim: data.data_fim ? new Date(data.data_fim) : undefined,
    },
    include: {
      criador: true,
      metrica: true,
    },
  });
}

async function deletarDesafio(id, criadorId) {
  const desafio = await prisma.desafio.findUnique({
    where: { id_desafio: id },
  });

  if (!desafio) {
    const err = new Error('Desafio não encontrado');
    err.statusCode = 404;
    throw err;
  }

  if (desafio.criador_id !== criadorId) {
    const err = new Error('Apenas o criador pode excluir o desafio');
    err.statusCode = 403;
    throw err;
  }

  await prisma.desafio.delete({
    where: { id_desafio: id },
  });
}

async function buscarRanking(desafioId) {
  const desafio = await prisma.desafio.findUnique({
    where: { id_desafio: desafioId },
  });

  if (!desafio) {
    const err = new Error('Desafio não encontrado');
    err.statusCode = 404;
    throw err;
  }

  const participacoes = await prisma.participacao.findMany({
    where: { desafio_id: desafioId },
    include: {
      usuario: true,
      checkins: true,
    },
    orderBy: {
      progresso_total: 'desc',
    },
  });

  return participacoes.map((p, index) => ({
    posicao: index + 1,
    id_usuario: p.usuario.id_usuario,
    nome: p.usuario.nome,
    foto: p.usuario.foto,
    progresso_total: p.progresso_total,
    total_checkins: p.checkins.length,
  }));
}

async function buscarPorCodigoConvite(codigo) {
  const desafio = await prisma.desafio.findUnique({
    where: { cod_convite: codigo },
    include: {
      criador: true,
      metrica: true,
    },
  });

  if (!desafio) {
    const err = new Error('Desafio não encontrado');
    err.statusCode = 404;
    throw err;
  }

  return desafio;
}

module.exports = {
  criarDesafio,
  listarDesafios,
  listarDesafiosDoUsuario,
  buscarDesafioPorId,
  atualizarDesafio,
  deletarDesafio,
  buscarRanking,
  buscarPorCodigoConvite,
};
