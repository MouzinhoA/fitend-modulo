const { Router } = require('express');
const checkinController = require('../controllers/checkinController');
const { validar, criarCheckinSchema } = require('../validators/checkinValidator');
const auth = require('../middlewares/auth');

const router = Router();

router.post('/:participacaoId', auth, validar(criarCheckinSchema), checkinController.criar);
router.get('/:participacaoId', auth, checkinController.listar);
router.get('/desafio/:desafioId', auth, checkinController.listarDoDesafio);

module.exports = router;
