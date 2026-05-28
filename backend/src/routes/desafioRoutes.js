const { Router } = require('express');
const desafioController = require('../controllers/desafioController');
const { validar, criarDesafioSchema, atualizarDesafioSchema } = require('../validators/desafioValidator');
const auth = require('../middlewares/auth');

const router = Router();

router.post('/', auth, validar(criarDesafioSchema), desafioController.criar);
router.get('/', auth, desafioController.listar);
router.get('/meus', auth, desafioController.listarMeus);
router.get('/convite/:codigo', auth, desafioController.buscarPorConvite);
router.get('/:id', auth, desafioController.buscarPorId);
router.put('/:id', auth, validar(atualizarDesafioSchema), desafioController.atualizar);
router.delete('/:id', auth, desafioController.deletar);
router.get('/:id/ranking', auth, desafioController.ranking);

module.exports = router;
