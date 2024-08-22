
// Unit tests for: hashPassword


import bcrypt from 'bcrypt';

import UsuarioController from '../usuarioController';


jest.mock("bcrypt");

describe('UsuarioController.hashPassword() hashPassword method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should hash the password successfully', async () => {
      // Arrange
      const plainPassword = 'securePassword123';
      const hashedPassword = 'hashedPassword123';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      // Act
      const result = await UsuarioController.hashPassword(plainPassword);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 8);
      expect(result).toBe(hashedPassword);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw an error if password is undefined', async () => {
      // Arrange
      const plainPassword = undefined;

      // Act & Assert
      await expect(UsuarioController.hashPassword(plainPassword)).rejects.toThrow();
    });

    it('should throw an error if password is null', async () => {
      // Arrange
      const plainPassword = null;

      // Act & Assert
      await expect(UsuarioController.hashPassword(plainPassword)).rejects.toThrow();
    });

    it('should throw an error if password is an empty string', async () => {
      // Arrange
      const plainPassword = '';

      // Act & Assert
      await expect(UsuarioController.hashPassword(plainPassword)).rejects.toThrow();
    });

    it('should handle bcrypt hash failure gracefully', async () => {
      // Arrange
      const plainPassword = 'securePassword123';
      const errorMessage = 'bcrypt error';
      bcrypt.hash.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(UsuarioController.hashPassword(plainPassword)).rejects.toThrow(errorMessage);
    });
  });
});

// End of unit tests for: hashPassword
