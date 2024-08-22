
// Unit tests for: checkUserExists

import UsuarioModel from '../../models/usuario.js';


import UsuarioController from '../usuarioController';




jest.mock("../../models/usuario");

describe('UsuarioController.checkUserExists() checkUserExists method', () => {
  // Happy Path
  describe('Happy Path', () => {
    it('should not throw an error if the user does not exist', async () => {
      // Arrange: Mock UsuarioModel.findOne to return null, simulating a non-existent user
      UsuarioModel.findOne.mockResolvedValue(null);
      
      // Act & Assert: Call checkUserExists and expect no error to be thrown
      await expect(UsuarioController.checkUserExists('nonexistent@example.com')).resolves.not.toThrow();
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should throw an error if the user already exists', async () => {
      // Arrange: Mock UsuarioModel.findOne to return a user object, simulating an existing user
      UsuarioModel.findOne.mockResolvedValue({ email: 'existing@example.com' });
      
      // Act & Assert: Call checkUserExists and expect an error to be thrown
      await expect(UsuarioController.checkUserExists('existing@example.com')).rejects.toThrow('Usuário já cadastrado. Por favor, utilize outro email.');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange: Mock UsuarioModel.findOne to throw an error, simulating a database error
      UsuarioModel.findOne.mockRejectedValue(new Error('Database error'));
      
      // Act & Assert: Call checkUserExists and expect the error to be propagated
      await expect(UsuarioController.checkUserExists('error@example.com')).rejects.toThrow('Database error');
    });
  });
});

// End of unit tests for: checkUserExists
