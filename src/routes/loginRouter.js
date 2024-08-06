import express from 'express';
import LoginController from '../controllers/loginController.js';

const router = express.Router();

/**
 * @route POST /login
 * @desc Realiza a autenticação do usuário
 * @access Public
 */
router.post('/login', LoginController.login);

export default router;
