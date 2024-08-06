import UsuarioModel from '../models/usuario.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 8;

export default class UsuarioController {
  static validateUserData({ nome, email, senha }) {
    if (!nome || !email || !senha) {
      throw { status: 400, message: 'Dados obrigatórios faltando!' };
    }
  }

  static async checkUserExists(email) {
    const usuarioExiste = await UsuarioModel.findOne({ email });
    if (usuarioExiste) {
      throw { status: 400, message: 'Usuário já cadastrado. Por favor, utilize outro email.' };
    }
  }

  static async hashPassword(senha) {
    return await bcrypt.hash(senha, SALT_ROUNDS);
  }

  static async criarUsuario(req, res) {
    try {
      const { nome, email, senha, foto } = req.body;

      UsuarioController.validateUserData(req.body);
      await UsuarioController.checkUserExists(email);

      const senhaHash = await UsuarioController.hashPassword(senha);

      const novoUsuario = await UsuarioModel.create({
        nome,
        email,
        senha: senhaHash,
        foto
      });

      res.status(201).json({ message: 'Novo usuário cadastrado com sucesso!', usuario: novoUsuario });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.status || 500, message: error.message || 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.' });
    }
  }

  static async listar(req, res) {
    try {
      const { nome, email, page = 1, perPage = 10 } = req.query;
      const limit = Math.min(parseInt(perPage), 10);

      const options = { page: parseInt(page), limit };

      const pesquisa = {
        nome: { $regex: nome || '', $options: 'i' },
        email: { $regex: email || '', $options: 'i' }
      };

      const usuarios = await UsuarioModel.paginate(pesquisa, options);

      if (!usuarios.docs.length) {
        throw { status: 404, message: 'Nenhum usuário encontrado. Tente ajustar os filtros de pesquisa.' };
      }

      res.status(200).json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.status || 500, message: error.message || 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.' });
    }
  }

  static async listarPorId(req, res) {
    try {
      const usuario = await UsuarioModel.findById(req.params.id);

      if (!usuario) {
        throw { status: 404, message: 'Usuário não encontrado. Verifique o ID e tente novamente.' };
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.status || 500, message: error.message || 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.' });
    }
  }

  static async alterarUsuario(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const usuario = await UsuarioModel.findById(req.params.id);

      if (!usuario) {
        throw { status: 404, message: 'Usuário não encontrado. Verifique o ID e tente novamente.' };
      }

      usuario.nome = nome || usuario.nome;
      usuario.email = email || usuario.email;

      if (senha) {
        usuario.senha = await UsuarioController.hashPassword(senha);
      }

      await usuario.save();

      res.status(200).json({ message: 'Dados do usuário atualizados com sucesso!', usuario });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.status || 500, message: error.message || 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.' });
    }
  }

  static async deletarUsuario(req, res) {
    try {
      const usuario = await UsuarioModel.findByIdAndDelete(req.params.id);

      if (!usuario) {
        throw { status: 404, message: 'Usuário não encontrado. Verifique o ID e tente novamente.' };
      }

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.status || 500, message: error.message || 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.' });
    }
  }
}
