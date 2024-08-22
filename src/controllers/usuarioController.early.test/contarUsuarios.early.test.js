
// Unit tests for: contarUsuarios

import UsuarioModel from '../../models/usuario.js';


import UsuarioController from '../usuarioController';



jest.mock("../../models/usuario.js");

describe('UsuarioController.contarUsuarios() contarUsuarios method', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Path', () => {
    it('should return the total number of users', async () => {
      // Arrange
      const totalUsuarios = 5;
      UsuarioModel.countDocuments.mockResolvedValue(totalUsuarios);

      // Act
      await UsuarioController.contarUsuarios(req, res);

      // Assert
      expect(UsuarioModel.countDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ totalUsuarios });
    });
  });

  describe('Edge Cases', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange
      const errorMessage = 'Database error';
      UsuarioModel.countDocuments.mockRejectedValue(new Error(errorMessage));

      // Act
      await UsuarioController.contarUsuarios(req, res);

      // Assert
      expect(UsuarioModel.countDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 500,
        message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.',
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const unexpectedError = { status: 503, message: 'Service Unavailable' };
      UsuarioModel.countDocuments.mockRejectedValue(unexpectedError);

      // Act
      await UsuarioController.contarUsuarios(req, res);

      // Assert
      expect(UsuarioModel.countDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        error: 503,
        message: 'Service Unavailable',
      });
    });
  });
});

// End of unit tests for: contarUsuarios
