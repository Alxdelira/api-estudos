
// Unit tests for: mostrarImagem

import fs from 'fs';

import path from 'path';


import ImagemModel from '../../models/image.js';


import ImagensControllers from '../imageController';



jest.mock("fs");
jest.mock("path");
jest.mock("../../models/image.js");

describe('ImagensControllers.mostrarImagem() mostrarImagem method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: 'mockImageId',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendFile: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Happy Path', () => {
    it('should send the image file when it exists in the database and filesystem', async () => {
      // Arrange
      const mockImage = {
        caminho: '/imagens/mockImage.jpg',
      };
      ImagemModel.findById.mockResolvedValue(mockImage);
      fs.existsSync.mockReturnValue(true);
      path.resolve.mockReturnValue('/absolute/path/to/mockImage.jpg');

      // Act
      await ImagensControllers.mostrarImagem(req, res, next);

      // Assert
      expect(ImagemModel.findById).toHaveBeenCalledWith('mockImageId');
      expect(fs.existsSync).toHaveBeenCalledWith('/absolute/path/to/mockImage.jpg');
      expect(res.sendFile).toHaveBeenCalledWith('/absolute/path/to/mockImage.jpg');
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 if the image is not found in the database', async () => {
      // Arrange
      ImagemModel.findById.mockResolvedValue(null);

      // Act
      await ImagensControllers.mostrarImagem(req, res, next);

      // Assert
      expect(ImagemModel.findById).toHaveBeenCalledWith('mockImageId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 404,
        mensagem: 'Imagem não encontrada',
      });
    });

    it('should return 404 if the image file does not exist in the filesystem', async () => {
      // Arrange
      const mockImage = {
        caminho: '/imagens/mockImage.jpg',
      };
      ImagemModel.findById.mockResolvedValue(mockImage);
      fs.existsSync.mockReturnValue(false);
      path.resolve.mockReturnValue('/absolute/path/to/mockImage.jpg');

      // Act
      await ImagensControllers.mostrarImagem(req, res, next);

      // Assert
      expect(ImagemModel.findById).toHaveBeenCalledWith('mockImageId');
      expect(fs.existsSync).toHaveBeenCalledWith('/absolute/path/to/mockImage.jpg');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 404,
        mensagem: 'Imagem não encontrada no sistema de arquivos',
      });
    });

    it('should return 500 if there is an internal server error', async () => {
      // Arrange
      ImagemModel.findById.mockRejectedValue(new Error('Internal Server Error'));

      // Act
      await ImagensControllers.mostrarImagem(req, res, next);

      // Assert
      expect(ImagemModel.findById).toHaveBeenCalledWith('mockImageId');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    });
  });
});

// End of unit tests for: mostrarImagem
