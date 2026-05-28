const { z } = require('zod');
const { validar } = require('./index');

const participarSchema = z.object({
  cod_convite: z.string({ required_error: 'Código de convite é obrigatório' })
    .min(1, 'Código de convite inválido'),
});

module.exports = { participarSchema, validar };
