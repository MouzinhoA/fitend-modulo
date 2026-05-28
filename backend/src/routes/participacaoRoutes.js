const { Router } = require('express');
const participacaoController = require('../controllers/participacaoController');
const { validar, participarSchema } = require('../validators/participacaoValidator');
const auth = require('../middlewares/auth');

const router = Router();

router.post('/', auth, validar(participarSchema), participacaoController.participar);
router.get('/', auth, participacaoController.listar);
router.delete('/:id', auth, participacaoController.sair);

module.exports = router;
