const { z } = require('zod');
const { validar } = require('./index');

const criarUsuarioSchema = z.object({
  nome: z.string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),
  senha: z.string({ required_error: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  foto: z.string().optional().nullable(),
});

const loginSchema = z.object({
  email: z.string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),
  senha: z.string({ required_error: 'Senha é obrigatória' }),
});

const atualizarUsuarioSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  email: z.string().email('Email inválido').optional(),
  senha: z.string().min(6).optional(),
  senha_atual: z.string().optional(),
  foto: z.string().optional().nullable(),
});

module.exports = {
  criarUsuarioSchema,
  loginSchema,
  atualizarUsuarioSchema,
  validar,
};
