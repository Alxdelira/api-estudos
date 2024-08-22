
// Unit tests for: listarImagens




import ImagemModel from '../../models/image.js';


import ImagensControllers from '../imageController';


jest.mock("../../models/image.js");
jest.mock("../../models/usuario.js");

describe('ImagensControllers.listarImagens() listarImagens method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Happy Path', () => {
    it('should return a list of images with status 200 when images are found', async () => {
      // Arrange
      const mockImages = [
        { id_imagem: '1', tipo_arquivo: 'jpg', enviado_por: 'user1', caminho: '/imagens/1.jpg' },
        { id_imagem: '2', tipo_arquivo: 'png', enviado_por: 'user2', caminho: '/imagens/2.png' },
      ];
      ImagemModel.find.mockResolvedValue(mockImages);

      // Act
      await ImagensControllers.listarImagens(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockImages);
    });
  });

  describe('Edge Cases', () => {
    it('should return status 404 with a message when no images are found', async () => {
      // Arrange
      ImagemModel.find.mockResolvedValue([]);

      // Act
      await ImagensControllers.listarImagens(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 404,
        mensagem: 'Nenhuma imagem encontrada',
      });
    });

    it('should return status 500 with a message when an error occurs', async () => {
      // Arrange
      const errorMessage = 'Database error';
      ImagemModel.find.mockRejectedValue(new Error(errorMessage));

      // Act
      await ImagensControllers.listarImagens(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    });
  });
});

// End of unit tests for: listarImagens
