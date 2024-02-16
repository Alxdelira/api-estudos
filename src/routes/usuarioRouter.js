import express from 'express';
import usuarioController from '../controllers/usuarioController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router
  .get('/usuarios', authMiddleware, usuarioController.listar)
  .post('/usuarios', authMiddleware, usuarioController.criarUsuario)
  .get('/usuarios/:id', authMiddleware, usuarioController.listarPorId)
  .put('/usuarios/:id', authMiddleware, usuarioController.alterarUsuario)
  .delete('/usuarios/:id', authMiddleware, usuarioController.deletarUsuario);

export default router;
