const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');
const {
  validar,
  criarUsuarioSchema,
  loginSchema,
  atualizarUsuarioSchema,
} = require('../validators/usuarioValidator');
const auth = require('../middlewares/auth');

const router = Router();

router.post('/cadastrar', validar(criarUsuarioSchema), usuarioController.cadastrar);
router.post('/login', validar(loginSchema), usuarioController.login);
router.get('/', auth, usuarioController.listar);
router.get('/perfil', auth, usuarioController.buscarPerfil);
router.get('/:id', auth, usuarioController.buscarPorId);
router.put('/perfil', auth, validar(atualizarUsuarioSchema), usuarioController.atualizar);
router.delete('/perfil', auth, usuarioController.deletar);

module.exports = router;
