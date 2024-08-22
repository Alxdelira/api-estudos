
// Unit tests for: atualizarImagem

import fs from 'fs';

import path from 'path';

import { promisify } from 'util';

import ImagemModel from '../../models/image.js';

import UsuarioModel from '../../models/usuario.js';

import ImagensControllers from '../imageController';



jest.mock("fs");
jest.mock("path");
jest.mock("../../models/image.js");
jest.mock("../../models/usuario.js");

const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);
const mkdirAsync = promisify(fs.mkdir);

describe('ImagensControllers.atualizarImagem() atualizarImagem method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      file: {
        filename: 'test.jpg',
        path: '/temp/test.jpg',
      },
      params: {
        id: 'user123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('Happy Path', () => {
    it('should update the image successfully when all conditions are met', async () => {
      // Arrange
      const mockUser = { _id: 'user123', foto: null, save: jest.fn() };
      const mockImage = { _id: 'image123', deleteOne: jest.fn() };

      UsuarioModel.findById.mockResolvedValue(mockUser);
      ImagemModel.findById.mockResolvedValue(null);
      ImagemModel.prototype.save = jest.fn().mockResolvedValue(mockImage);
      fs.existsSync.mockReturnValue(false);
      path.resolve.mockReturnValue('/imagens/test.jpg');
      renameAsync.mockResolvedValue();
      mkdirAsync.mockResolvedValue();

      // Act
      await ImagensControllers.atualizarImagem(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 200,
        mensagem: 'Imagem atualizada com sucesso',
        dados: mockImage,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 if no file is provided', async () => {
      // Arrange
      req.file = null;

      // Act
      await ImagensControllers.atualizarImagem(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 400,
        mensagem: 'Arquivo inválido',
      });
    });

    it('should return 404 if user is not found', async () => {
      // Arrange
      UsuarioModel.findById.mockResolvedValue(null);

      // Act
      await ImagensControllers.atualizarImagem(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 404,
        mensagem: 'Usuário não encontrado',
      });
    });

    it('should handle existing image removal gracefully', async () => {
      // Arrange
      const mockUser = { _id: 'user123', foto: 'image123', save: jest.fn() };
      const mockImage = { _id: 'image123', deleteOne: jest.fn() };

      UsuarioModel.findById.mockResolvedValue(mockUser);
      ImagemModel.findById.mockResolvedValue(mockImage);
      fs.existsSync.mockReturnValue(true);
      unlinkAsync.mockResolvedValue();

      // Act
      await ImagensControllers.atualizarImagem(req, res, next);

      // Assert
      expect(unlinkAsync).toHaveBeenCalled();
      expect(mockImage.deleteOne).toHaveBeenCalled();
    });

    it('should return 500 on internal server error', async () => {
      // Arrange
      UsuarioModel.findById.mockRejectedValue(new Error('Database error'));

      // Act
      await ImagensControllers.atualizarImagem(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    });
  });
});

// End of unit tests for: atualizarImagem
