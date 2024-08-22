
// Unit tests for: criarUsuario

import UsuarioModel from '../../models/usuario.js';

import bcrypt from 'bcrypt';

import UsuarioController from '../usuarioController';



jest.mock("../../models/usuario.js");
jest.mock("bcrypt");

describe('UsuarioController.criarUsuario() criarUsuario method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'password123',
        foto: 'photoId'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    UsuarioModel.findOne.mockClear();
    UsuarioModel.create.mockClear();
    bcrypt.hash.mockClear();
  });

  // Happy Path
  it('should create a new user successfully', async () => {
    // Arrange
    UsuarioModel.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    UsuarioModel.create.mockResolvedValue({ id: 'userId', ...req.body, senha: 'hashedPassword' });

    // Act
    await UsuarioController.criarUsuario(req, res);

    // Assert
    expect(UsuarioModel.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.senha, 8);
    expect(UsuarioModel.create).toHaveBeenCalledWith({
      nome: req.body.nome,
      email: req.body.email,
      senha: 'hashedPassword',
      foto: req.body.foto
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Novo usuário cadastrado com sucesso!',
      usuario: { id: 'userId', ...req.body, senha: 'hashedPassword' }
    });
  });

  // Edge Cases
  it('should return 400 if required fields are missing', async () => {
    // Arrange
    req.body = { email: 'test@example.com', senha: 'password123' }; // Missing 'nome'

    // Act
    await UsuarioController.criarUsuario(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 400,
      message: 'Dados obrigatórios faltando!'
    });
  });

  it('should return 400 if user already exists', async () => {
    // Arrange
    UsuarioModel.findOne.mockResolvedValue({ id: 'existingUserId' });

    // Act
    await UsuarioController.criarUsuario(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 400,
      message: 'Usuário já cadastrado. Por favor, utilize outro email.'
    });
  });

  it('should handle bcrypt hash errors gracefully', async () => {
    // Arrange
    UsuarioModel.findOne.mockResolvedValue(null);
    bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

    // Act
    await UsuarioController.criarUsuario(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 500,
      message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.'
    });
  });

  it('should handle database creation errors gracefully', async () => {
    // Arrange
    UsuarioModel.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    UsuarioModel.create.mockRejectedValue(new Error('Database error'));

    // Act
    await UsuarioController.criarUsuario(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 500,
      message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.'
    });
  });
});

// End of unit tests for: criarUsuario
