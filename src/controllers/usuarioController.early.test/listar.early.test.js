
// Unit tests for: listar

import UsuarioModel from '../../models/usuario.js';


import UsuarioController from '../usuarioController';



jest.mock("../../models/usuario.js");

describe('UsuarioController.listar() listar method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Happy Path', () => {
    it('should return a list of users when users are found', async () => {
      // Arrange
      const mockUsers = {
        docs: [
          { toObject: () => ({ nome: 'John Doe', email: 'john@example.com', foto: { id: '123' } }) },
          { toObject: () => ({ nome: 'Jane Doe', email: 'jane@example.com', foto: { id: '456' } }) }
        ],
        totalDocs: 2,
        limit: 10,
        page: 1,
        totalPages: 1
      };
      UsuarioModel.paginate.mockResolvedValue(mockUsers);

      // Act
      await UsuarioController.listar(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockUsers,
        docs: [
          { nome: 'John Doe', email: 'john@example.com', foto: '123' },
          { nome: 'Jane Doe', email: 'jane@example.com', foto: '456' }
        ]
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 when no users are found', async () => {
      // Arrange
      const mockUsers = { docs: [] };
      UsuarioModel.paginate.mockResolvedValue(mockUsers);

      // Act
      await UsuarioController.listar(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 404,
        message: 'Nenhum usuário encontrado. Tente ajustar os filtros de pesquisa.'
      });
    });

    it('should handle invalid page and perPage query parameters gracefully', async () => {
      // Arrange
      req.query.page = 'invalid';
      req.query.perPage = 'invalid';
      const mockUsers = {
        docs: [
          { toObject: () => ({ nome: 'John Doe', email: 'john@example.com', foto: { id: '123' } }) }
        ],
        totalDocs: 1,
        limit: 10,
        page: 1,
        totalPages: 1
      };
      UsuarioModel.paginate.mockResolvedValue(mockUsers);

      // Act
      await UsuarioController.listar(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockUsers,
        docs: [
          { nome: 'John Doe', email: 'john@example.com', foto: '123' }
        ]
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const error = new Error('Database error');
      UsuarioModel.paginate.mockRejectedValue(error);

      // Act
      await UsuarioController.listar(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 500,
        message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.'
      });
    });
  });
});

// End of unit tests for: listar
