
// Unit tests for: listarPorId

import UsuarioModel from '../../models/usuario.js';


import UsuarioController from '../usuarioController';


import { jest } from '@jest/globals';


jest.mock("../../models/usuario.js");

describe('UsuarioController.listarPorId() listarPorId method', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'validUserId' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Path', () => {
    it('should return user data when a valid ID is provided', async () => {
      // Arrange
      const mockUser = {
        _id: 'validUserId',
        nome: 'John Doe',
        email: 'john.doe@example.com',
        foto: { id: 'photoId' },
        toObject: jest.fn().mockReturnValue({
          _id: 'validUserId',
          nome: 'John Doe',
          email: 'john.doe@example.com',
          foto: { id: 'photoId' },
        }),
      };
      UsuarioModel.findById.mockResolvedValue(mockUser);

      // Act
      await UsuarioController.listarPorId(req, res);

      // Assert
      expect(UsuarioModel.findById).toHaveBeenCalledWith('validUserId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'validUserId',
        nome: 'John Doe',
        email: 'john.doe@example.com',
        foto: 'photoId',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 error when user is not found', async () => {
      // Arrange
      UsuarioModel.findById.mockResolvedValue(null);

      // Act
      await UsuarioController.listarPorId(req, res);

      // Assert
      expect(UsuarioModel.findById).toHaveBeenCalledWith('validUserId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 404,
        message: 'Usuário não encontrado. Verifique o ID e tente novamente.',
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const error = new Error('Database error');
      UsuarioModel.findById.mockRejectedValue(error);

      // Act
      await UsuarioController.listarPorId(req, res);

      // Assert
      expect(UsuarioModel.findById).toHaveBeenCalledWith('validUserId');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 500,
        message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.',
      });
    });

    it('should return 500 error for invalid ID format', async () => {
      // Arrange
      req.params.id = 'invalidId';
      const error = new Error('Cast to ObjectId failed');
      UsuarioModel.findById.mockRejectedValue(error);

      // Act
      await UsuarioController.listarPorId(req, res);

      // Assert
      expect(UsuarioModel.findById).toHaveBeenCalledWith('invalidId');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 500,
        message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.',
      });
    });
  });
});

// End of unit tests for: listarPorId
