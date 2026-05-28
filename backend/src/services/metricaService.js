const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listarMetricas() {
  return prisma.metrica.findMany();
}

async function buscarMetricaPorId(id) {
  const metrica = await prisma.metrica.findUnique({
    where: { id_metrica: id },
  });

  if (!metrica) {
    const err = new Error('Métrica não encontrada');
    err.statusCode = 404;
    throw err;
  }

  return metrica;
}

module.exports = { listarMetricas, buscarMetricaPorId };
