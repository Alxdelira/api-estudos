
// Unit tests for: enviarImagem

import fs from 'fs';


import { promisify } from 'util';

import ImagemModel from '../../models/image.js';

import UsuarioModel from '../../models/usuario.js';

import ImagensControllers from '../imageController';



jest.mock("fs");
jest.mock("path");
jest.mock("util");
jest.mock("../../models/image.js");
jest.mock("../../models/usuario.js");

const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);
const mkdirAsync = promisify(fs.mkdir);

describe('ImagensControllers.enviarImagem() enviarImagem method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      file: {
        filename: 'test.jpg',
        path: '/tmp/test.jpg',
      },
      usuario: {
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
    it('should successfully upload an image and return 201 status', async () => {
      // Arrange
      UsuarioModel.findById.mockResolvedValue('user123');
      ImagemModel.prototype.save.mockResolvedValue();
      UsuarioModel.findByIdAndUpdate.mockResolvedValue();
      mkdirAsync.mockResolvedValue();
      renameAsync.mockResolvedValue();

      // Act
      await ImagensControllers.enviarImagem(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        codigo: 201,
        mensagem: 'Imagem enviada com sucesso',
        dados: expect.any(Object),
      }));
    });
  });

  describe('Edge Cases', () => {
    it('should return 400 if no file is provided', async () => {
      // Arrange
      req.file = null;

      // Act
      await ImagensControllers.enviarImagem(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 400,
        mensagem: 'Arquivo inválido',
      });
    });

    it('should return 500 if there is an error saving the image', async () => {
      // Arrange
      UsuarioModel.findById.mockResolvedValue('user123');
      ImagemModel.prototype.save.mockRejectedValue(new Error('Database error'));

      // Act
      await ImagensControllers.enviarImagem(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    });

    it('should return 500 if there is an error moving the file', async () => {
      // Arrange
      UsuarioModel.findById.mockResolvedValue('user123');
      ImagemModel.prototype.save.mockResolvedValue();
      renameAsync.mockRejectedValue(new Error('File system error'));

      // Act
      await ImagensControllers.enviarImagem(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    });

    it('should remove the file if an error occurs after moving it', async () => {
      // Arrange
      UsuarioModel.findById.mockResolvedValue('user123');
      ImagemModel.prototype.save.mockResolvedValue();
      renameAsync.mockResolvedValue();
      UsuarioModel.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));
      unlinkAsync.mockResolvedValue();

      // Act
      await ImagensControllers.enviarImagem(req, res, next);

      // Assert
      expect(unlinkAsync).toHaveBeenCalledWith(expect.stringContaining('imagens/test.jpg'));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    });
  });
});

// End of unit tests for: enviarImagem
