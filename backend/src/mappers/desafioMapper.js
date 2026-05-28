function desafioParaResposta(desafio) {
  return {
    id_desafio: desafio.id_desafio,
    titulo: desafio.titulo,
    descricao: desafio.descricao,
    data_inicio: desafio.data_inicio,
    data_fim: desafio.data_fim,
    status: desafio.status,
    cod_convite: desafio.cod_convite,
    criador: desafio.criador ? {
      id_usuario: desafio.criador.id_usuario,
      nome: desafio.criador.nome,
    } : undefined,
    metrica: desafio.metrica ? {
      id_metrica: desafio.metrica.id_metrica,
      nome: desafio.metrica.nome,
      sigla: desafio.metrica.sigla,
      tipo_dado: desafio.metrica.tipo_dado,
    } : undefined,
    criado_em: desafio.created_at,
  };
}

module.exports = { desafioParaResposta };
