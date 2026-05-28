function checkinParaResposta(checkin) {
  return {
    id_checkin: checkin.id_checkin,
    data_hora: checkin.data_hora,
    valor_registrado: checkin.valor_registrado,
    foto_url: checkin.foto_url,
    criado_em: checkin.created_at,
  };
}

module.exports = { checkinParaResposta };
