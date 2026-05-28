function usuarioParaResposta(usuario) {
  return {
    id_usuario: usuario.id_usuario,
    nome: usuario.nome,
    email: usuario.email,
    foto: usuario.foto,
    criado_em: usuario.created_at,
  };
}

module.exports = { usuarioParaResposta };
