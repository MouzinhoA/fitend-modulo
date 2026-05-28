const { z } = require('zod');
const { validar } = require('./index');

const criarDesafioSchema = z.object({
  titulo: z.string({ required_error: 'Título é obrigatório' })
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  descricao: z.string({ required_error: 'Descrição é obrigatória' })
    .min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  data_inicio: z.string({ required_error: 'Data de início é obrigatória' })
    .datetime('Data de início inválida'),
  data_fim: z.string({ required_error: 'Data de fim é obrigatória' })
    .datetime('Data de fim inválida'),
  metrica_id: z.string({ required_error: 'Métrica é obrigatória' })
    .uuid('ID de métrica inválido'),
});

const atualizarDesafioSchema = z.object({
  titulo: z.string().min(3).max(100).optional(),
  descricao: z.string().min(10).optional(),
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  status: z.enum(['Pendente', 'Ativo', 'Encerrado', 'Cancelado']).optional(),
});

module.exports = { criarDesafioSchema, atualizarDesafioSchema, validar };
