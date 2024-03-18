import id from 'faker-br/lib/locales/id_ID/index.js';
import UsuarioModel from '../models/usuario.js';
import bcrypt from 'bcrypt';

export default class usuarioController {
  static async criarUsuario(req, res) {
    try {
      const { nome, email, senha, foto } = req.body;
      const novoUsuario = new UsuarioModel({
        nome,
        email,
        foto,
        senha
      });
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 400, message: 'Dados Obrigatórios Faltando!' });
      }
      const usuarioExiste = await Usuario
        .findOne({ email });
      if (usuarioExiste) {
        return res.status(400).json({ error: 400, message: 'Usuário Já Cadastrado!' });
      }
      let senhaHash = await bcrypt.hash(senha, 8);
      novoUsuario.senha = senhaHash;
      await novoUsuario.save();
      res.status(201).json({ message: 'Novo Usuário Cadastrado com Sucesso!', novoUsuario });
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro interno no Servidor' });
    }
  }

  static async listar(req, res) {
    try {
      const { nome, email, page, perPage } = req.query;
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(perPage) > 10 ? 10 : parseInt(perPage) || 10
      };

      const pesquisa = {
        nome: { $regex: nome || '', $options: 'i' },
        email: { $regex: email || '', $options: 'i' }
      };

      const usuarios = await UsuarioModel.paginate(pesquisa, options);

      if (!usuarios.docs.length) {
        return res.status(404).json({ error: 404, message: 'Usuário Não Encontrado!' });
      }

      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro Interno no Servidor!' });
    }
  }

  static async listarPorId(req, res) {
    try {
      const usuario = await UsuarioModel.findById(req.params.id);

      if (!usuario) {
        return res.status(404).json({ error: 404, message: 'Usuário Não Encontrado!' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro Interno no Servidor!' });
    }
  }

  static async alterarUsuario(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const usuario = await UsuarioModel.findById(req.params.id);

      if (!usuario) {
        return res.status(404).json({ error: 404, message: 'Usuário Não Encontrado!' });
      }

      usuario.nome = nome || usuario.nome;
      usuario.email = email || usuario.email;
      if (senha) {
        let senhaHash = await bcrypt.hash(senha, 8);
        usuario.senha = senhaHash;
      }

      await usuario.save();

      res.status(200).json({ message: 'Usuário Alterado com Sucesso!', usuario });
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro Interno no Servidor!' });
    }
  }

  static async deletarUsuario(req, res) {
    try {
      const usuario = await UsuarioModel.findByIdAndDelete(req.params.id);

      if (!usuario) {
        return res.status(404).json({ error: 404, message: 'Usuário Não Encontrado!' });
      }

      res.status(200).json({ message: 'Usuário Deletado com Sucesso!', usuario });
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro Interno no Servidor!' });
    }
  }
}
