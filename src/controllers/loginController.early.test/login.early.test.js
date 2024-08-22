
// Unit tests for: login

import UsuarioModel from '../../models/usuario.js';

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';


import LoginController from '../loginController';


jest.mock("../../models/usuario.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe('LoginController.login() login method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Happy Path
  describe('Happy Path', () => {
    it('should return a token and user info when login is successful', async () => {
      req.body = { email: 'test@example.com', senha: 'password123' };

      const mockUser = {
        _id: 'userId123',
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'hashedPassword',
        foto: { id: 'photoId123' }
      };

      UsuarioModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      await LoginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mockToken',
        usuario: {
          nome: 'Test User',
          email: 'test@example.com',
          foto: 'photoId123'
        }
      });
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should return 400 if email or senha is missing', async () => {
      req.body = { email: '', senha: '' };

      await LoginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Credenciais inválidas. Verifique seu email e senha e tente novamente.'
      });
    });

    it('should return 404 if user is not found', async () => {
      req.body = { email: 'notfound@example.com', senha: 'password123' };

      UsuarioModel.findOne.mockResolvedValue(null);

      await LoginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário não encontrado. Verifique se o email está correto ou registre-se para criar uma conta.'
      });
    });

    it('should return 400 if password is incorrect', async () => {
      req.body = { email: 'test@example.com', senha: 'wrongpassword' };

      const mockUser = {
        _id: 'userId123',
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'hashedPassword'
      };

      UsuarioModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await LoginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Credenciais inválidas. Verifique seu email e senha e tente novamente.'
      });
    });

    it('should return 500 if secret is not defined', async () => {
      req.body = { email: 'test@example.com', senha: 'password123' };

      const mockUser = {
        _id: 'userId123',
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'hashedPassword'
      };

      UsuarioModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const originalSecret = process.env.SECRET;
      delete process.env.SECRET;

      await LoginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.'
      });

      process.env.SECRET = originalSecret;
    });

    it('should return 500 if an unexpected error occurs', async () => {
      req.body = { email: 'test@example.com', senha: 'password123' };

      UsuarioModel.findOne.mockRejectedValue(new Error('Unexpected error'));

      await LoginController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.'
      });
    });
  });
});

// End of unit tests for: login
