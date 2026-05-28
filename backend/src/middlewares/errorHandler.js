function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      detalhes: err.errors.map(e => ({
        campo: e.path.join('.'),
        mensagem: e.message,
      })),
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Registro duplicado',
      detalhes: `O campo ${err.meta?.target?.join(', ')} já existe`,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado',
    });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
}

module.exports = errorHandler;
