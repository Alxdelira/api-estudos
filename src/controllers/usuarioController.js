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

      const pesquisa = {
        nome: { $regex: nome || '', $options: 'i' },
        email: { $regex: email || '', $options: 'i' }
      };

      const usuarios = await UsuarioModel.paginate(pesquisa, { page: parseInt(page), limit });

      if (!usuarios.docs.length) {
        throw { status: 404, message: 'Nenhum usuário encontrado. Tente ajustar os filtros de pesquisa.' };
      }

      // Realizar o populate manualmente em cada documento
      for (let i = 0; i < usuarios.docs.length; i++) {
        await usuarios.docs[i].populate('foto');
      }

      // Ajustar a resposta para incluir apenas o caminho da foto
      const usuariosResponse = usuarios.docs.map(usuario => ({
        ...usuario.toObject(),
        foto: usuario.foto ? usuario.foto.id_imagem : null
      }));

      res.status(200).json({
        ...usuarios,
        docs: usuariosResponse
      });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.status || 500, message: error.message || 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.' });
    }
  }
  static async contarUsuarios(req, res) {
    try {
    
      const totalUsuarios = await UsuarioModel.countDocuments();      
      res.status(200).json({ totalUsuarios });
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({
        error: error.status || 500,
        message: error.message || 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.'
      });
    }
  }

  static async listarPorId(req, res) {
    try {
      const usuario = await UsuarioModel.findById(req.params.id)
        .populate('foto');

      if (!usuario) {
        throw { status: 404, message: 'Usuário não encontrado. Verifique o ID e tente novamente.' };
      }

      // Ajustar a resposta para incluir apenas o caminho da foto
      const usuarioResponse = {
        ...usuario.toObject(),
        foto: usuario.foto ? usuario.foto.id_imagem : null
      };

      res.status(200).json(usuarioResponse);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.status || 500, message: error.message || 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.' });
    }
  }

  static async alterarUsuario(req, res) {
    try {
      const { nome, email, senha, foto } = req.body; // Recebe o ID da foto no corpo da requisição
      const usuario = await UsuarioModel.findById(req.params.id);

      if (!usuario) {
        throw { status: 404, message: 'Usuário não encontrado. Verifique o ID e tente novamente.' };
      }

      // Atualiza os campos do usuário apenas se foram fornecidos na requisição
      usuario.nome = nome || usuario.nome;
      usuario.email = email || usuario.email;

      if (senha) {
        usuario.senha = await UsuarioController.hashPassword(senha);
      }

      if (foto) {
        usuario.foto = foto; // Atualiza o campo foto com o novo ID
      }

      if (!usuario.nome) {
        throw { status: 400, message: 'Nome do usuário é obrigatório!' };
      }

      await usuario.save();



      // Ajustar a resposta para incluir apenas o caminho da foto
      const usuarioResponse = {
        ...usuario.toObject(),
        foto: usuario.foto ? usuario.foto.id_imagem : null
      };

      res.status(200).json({ message: 'Dados do usuário atualizados com sucesso!', usuario: usuarioResponse });
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
