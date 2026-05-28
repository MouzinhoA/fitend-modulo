const usuarioService = require('../services/usuarioService');
const { usuarioParaResposta } = require('../mappers/usuarioMapper');

async function cadastrar(req, res, next) {
  try {
    const usuario = await usuarioService.criarUsuario(req.body);
    res.status(201).json(usuarioParaResposta(usuario));
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { usuario, token } = await usuarioService.login(req.body);
    res.json({
      token,
      usuario: usuarioParaResposta(usuario),
    });
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios.map(usuarioParaResposta));
  } catch (err) {
    next(err);
  }
}

async function buscarPerfil(req, res, next) {
  try {
    const usuario = await usuarioService.buscarUsuarioPorId(req.usuario.id_usuario);
    res.json(usuarioParaResposta(usuario));
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const usuario = await usuarioService.buscarUsuarioPorId(req.params.id);
    res.json(usuarioParaResposta(usuario));
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const usuario = await usuarioService.atualizarUsuario(req.usuario.id_usuario, req.body);
    res.json(usuarioParaResposta(usuario));
  } catch (err) {
    next(err);
  }
}

async function deletar(req, res, next) {
  try {
    await usuarioService.deletarUsuario(req.usuario.id_usuario);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  cadastrar,
  login,
  listar,
  buscarPerfil,
  buscarPorId,
  atualizar,
  deletar,
};
