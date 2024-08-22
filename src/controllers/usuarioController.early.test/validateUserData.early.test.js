
// Unit tests for: validateUserData



import UsuarioController from '../usuarioController';

describe('UsuarioController.validateUserData() validateUserData method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should not throw an error when all required fields are provided', () => {
      // Arrange: Set up valid user data
      const validUserData = {
        nome: 'John Doe',
        email: 'john.doe@example.com',
        senha: 'securepassword123'
      };

      // Act & Assert: Validate user data without expecting an error
      expect(() => {
        UsuarioController.validateUserData(validUserData);
      }).not.toThrow();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw an error when nome is missing', () => {
      // Arrange: Set up user data with missing nome
      const userDataMissingNome = {
        email: 'john.doe@example.com',
        senha: 'securepassword123'
      };

      // Act & Assert: Validate user data and expect an error
      expect(() => {
        UsuarioController.validateUserData(userDataMissingNome);
      }).toThrow({
        status: 400,
        message: 'Dados obrigatórios faltando!'
      });
    });

    it('should throw an error when email is missing', () => {
      // Arrange: Set up user data with missing email
      const userDataMissingEmail = {
        nome: 'John Doe',
        senha: 'securepassword123'
      };

      // Act & Assert: Validate user data and expect an error
      expect(() => {
        UsuarioController.validateUserData(userDataMissingEmail);
      }).toThrow({
        status: 400,
        message: 'Dados obrigatórios faltando!'
      });
    });

    it('should throw an error when senha is missing', () => {
      // Arrange: Set up user data with missing senha
      const userDataMissingSenha = {
        nome: 'John Doe',
        email: 'john.doe@example.com'
      };

      // Act & Assert: Validate user data and expect an error
      expect(() => {
        UsuarioController.validateUserData(userDataMissingSenha);
      }).toThrow({
        status: 400,
        message: 'Dados obrigatórios faltando!'
      });
    });

    it('should throw an error when all fields are missing', () => {
      // Arrange: Set up empty user data
      const emptyUserData = {};

      // Act & Assert: Validate user data and expect an error
      expect(() => {
        UsuarioController.validateUserData(emptyUserData);
      }).toThrow({
        status: 400,
        message: 'Dados obrigatórios faltando!'
      });
    });
  });
});

// End of unit tests for: validateUserData
