const { Router } = require('express');
const metricaController = require('../controllers/metricaController');
const auth = require('../middlewares/auth');

const router = Router();

router.get('/', auth, metricaController.listar);
router.get('/:id', auth, metricaController.buscarPorId);

module.exports = router;
