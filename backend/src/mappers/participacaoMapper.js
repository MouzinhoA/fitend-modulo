function participacaoParaResposta(participacao) {
  return {
    id_participante: participacao.id_participante,
    data_ingresso: participacao.data_ingresso,
    progresso_total: participacao.progresso_total,
    usuario: participacao.usuario ? {
      id_usuario: participacao.usuario.id_usuario,
      nome: participacao.usuario.nome,
      foto: participacao.usuario.foto,
    } : undefined,
    desafio: participacao.desafio ? {
      id_desafio: participacao.desafio.id_desafio,
      titulo: participacao.desafio.titulo,
      status: participacao.desafio.status,
    } : undefined,
  };
}

module.exports = { participacaoParaResposta };
