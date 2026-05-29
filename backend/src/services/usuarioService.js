const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function criarUsuario(data) {
  const senhaHash = await bcrypt.hash(data.senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senha: senhaHash,
      foto: data.foto || null,
    },
  });

  return usuario;
}

async function login(data) {
  const usuario = await prisma.usuario.findUnique({
    where: { email: data.email },
  });

  if (!usuario) {
    const err = new Error('Email ou senha inválidos');
    err.statusCode = 401;
    throw err;
  }

  const senhaValida = await bcrypt.compare(data.senha, usuario.senha);

  if (!senhaValida) {
    const err = new Error('Email ou senha inválidos');
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: usuario.id_usuario },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  return { usuario, token };
}

async function listarUsuarios() {
  return prisma.usuario.findMany();
}

async function buscarUsuarioPorId(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
  });

  if (!usuario) {
    const err = new Error('Usuário não encontrado');
    err.statusCode = 404;
    throw err;
  }

  return usuario;
}

async function atualizarUsuario(id, data) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
  });

  if (!usuario) {
    const err = new Error('Usuário não encontrado');
    err.statusCode = 404;
    throw err;
  }

  if (data.senha) {
    if (!data.senha_atual) {
      const err = new Error('Senha atual é obrigatória para alterar a senha');
      err.statusCode = 400;
      throw err;
    }
    const senhaValida = await bcrypt.compare(data.senha_atual, usuario.senha);
    if (!senhaValida) {
      const err = new Error('Senha atual incorreta');
      err.statusCode = 401;
      throw err;
    }
    data.senha = await bcrypt.hash(data.senha, 10);
  }

  delete data.senha_atual;

  return prisma.usuario.update({
    where: { id_usuario: id },
    data,
  });
}

async function deletarUsuario(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
  });

  if (!usuario) {
    const err = new Error('Usuário não encontrado');
    err.statusCode = 404;
    throw err;
  }

  await prisma.usuario.delete({
    where: { id_usuario: id },
  });
}

module.exports = {
  criarUsuario,
  login,
  listarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  deletarUsuario,
};
