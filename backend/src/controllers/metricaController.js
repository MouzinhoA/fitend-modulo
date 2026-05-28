const metricaService = require('../services/metricaService');

async function listar(req, res, next) {
  try {
    const metricas = await metricaService.listarMetricas();
    res.json(metricas);
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const metrica = await metricaService.buscarMetricaPorId(req.params.id);
    res.json(metrica);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscarPorId };
