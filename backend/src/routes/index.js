const { Router } = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const desafioRoutes = require('./desafioRoutes');
const metricaRoutes = require('./metricaRoutes');
const participacaoRoutes = require('./participacaoRoutes');
const checkinRoutes = require('./checkinRoutes');

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/desafios', desafioRoutes);
router.use('/metricas', metricaRoutes);
router.use('/participacoes', participacaoRoutes);
router.use('/checkins', checkinRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', servico: 'FitEnd API' });
});

module.exports = router;
