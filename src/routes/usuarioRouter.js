import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const router = express.Router();

/**
 * @route GET /usuarios
 * @desc Lista todos os usuários
 * @access Private
 */
router.get('/usuarios', authMiddleware, UsuarioController.listar);

/**
 * @route POST /usuarios
 * @desc Cria um novo usuário
 * @access Private
 */
router.post('/usuarios', UsuarioController.criarUsuario);

/**
 * @route GET /usuarios/:id
 * @desc Recupera um usuário pelo ID
 * @access Private
 */
router.get('/usuarios/:id', authMiddleware, UsuarioController.listarPorId);

/**
 * @route GET /dashboard
 * @desc Retorna a quantidade de usuarios cadstrados
 * @access Public
 */
router.get('/dashboard', UsuarioController.contarUsuarios);

/**
 * @route PUT /usuarios/:id
 * @desc Atualiza um usuário pelo ID
 * @access Private
 */
router.put('/usuarios/:id', authMiddleware, UsuarioController.alterarUsuario);

/**
 * @route DELETE /usuarios/:id
 * @desc Deleta um usuário pelo ID
 * @access Private
 */
router.delete('/usuarios/:id', authMiddleware, UsuarioController.deletarUsuario);

export default router;
