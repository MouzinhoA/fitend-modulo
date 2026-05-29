const { z } = require('zod');
const { validar } = require('./index');

const criarCheckinSchema = z.object({
  valor_registrado: z.number({ required_error: 'Valor registrado é obrigatório' }),
  data_hora: z.string().datetime().optional(),
  foto_url: z.string().optional().nullable(),
});

module.exports = { criarCheckinSchema, validar };
