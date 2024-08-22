
// Unit tests for: deletarImagem

import fs from 'fs';

import path from 'path';


import ImagemModel from '../../models/image.js';


import ImagensControllers from '../imageController';



jest.mock("fs");
jest.mock("path");
jest.mock("../../models/image.js");


describe('ImagensControllers.deletarImagem() deletarImagem method', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { id: '123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Happy Path', () => {
    it('should delete the image successfully when it exists', async () => {
      // Arrange
      const mockImage = {
        _id: '123',
        caminho: '/imagens/test.jpg',
        deleteOne: jest.fn(),
      };
      ImagemModel.findById.mockResolvedValue(mockImage);
      fs.unlink.mockImplementation((path, callback) => callback(null));

      // Act
      await ImagensControllers.deletarImagem(req, res, next);

      // Assert
      expect(ImagemModel.findById).toHaveBeenCalledWith('123');
      expect(fs.unlink).toHaveBeenCalledWith(path.resolve('imagens', 'test.jpg'), expect.any(Function));
      expect(mockImage.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 200,
        mensagem: 'Imagem deletada com sucesso',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if the image is not found in the database', async () => {
      // Arrange
      ImagemModel.findById.mockResolvedValue(null);

      // Act
      await ImagensControllers.deletarImagem(req, res, next);

      // Assert
      expect(ImagemModel.findById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 404,
        mensagem: 'Imagem não encontrada',
      });
    });

    it('should return 500 if there is an error deleting the file', async () => {
      // Arrange
      const mockImage = {
        _id: '123',
        caminho: '/imagens/test.jpg',
        deleteOne: jest.fn(),
      };
      ImagemModel.findById.mockResolvedValue(mockImage);
      fs.unlink.mockImplementation((path, callback) => callback(new Error('File system error')));

      // Act
      await ImagensControllers.deletarImagem(req, res, next);

      // Assert
      expect(ImagemModel.findById).toHaveBeenCalledWith('123');
      expect(fs.unlink).toHaveBeenCalledWith(path.resolve('imagens', 'test.jpg'), expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    });

    it('should return 500 if there is an error deleting the image from the database', async () => {
      // Arrange
      const mockImage = {
        _id: '123',
        caminho: '/imagens/test.jpg',
        deleteOne: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      ImagemModel.findById.mockResolvedValue(mockImage);
      fs.unlink.mockImplementation((path, callback) => callback(null));

      // Act
      await ImagensControllers.deletarImagem(req, res, next);

      // Assert
      expect(ImagemModel.findById).toHaveBeenCalledWith('123');
      expect(fs.unlink).toHaveBeenCalledWith(path.resolve('imagens', 'test.jpg'), expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    });
  });
});

// End of unit tests for: deletarImagem
