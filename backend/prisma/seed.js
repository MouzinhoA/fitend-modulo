const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  const metricas = [
    { nome: 'Quilômetros', sigla: 'km', tipo_dado: 'numerico' },
    { nome: 'Litros de Água', sigla: 'L', tipo_dado: 'numerico' },
    { nome: 'Minutos de Exercício', sigla: 'min', tipo_dado: 'numerico' },
    { nome: 'Páginas Lidas', sigla: 'págs', tipo_dado: 'numerico' },
    { nome: 'Refeições Saudáveis', sigla: 'ref', tipo_dado: 'numerico' },
    { nome: 'Horas de Sono', sigla: 'h', tipo_dado: 'numerico' },
    { nome: 'Meditação (Concluiu)', sigla: 'sim/não', tipo_dado: 'booleano' },
    { nome: 'Passos', sigla: 'passos', tipo_dado: 'numerico' },
  ];

  for (const metrica of metricas) {
    await prisma.metrica.upsert({
      where: { nome: metrica.nome },
      create: metrica,
      update: {},
    });
  }

  console.log('Métricas cadastradas com sucesso!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
