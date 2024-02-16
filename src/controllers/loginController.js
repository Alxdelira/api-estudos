import UsuarioModel from '../models/usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.SECRET;

export default class LoginController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;
      const usuario = await UsuarioModel.findOne({ email }).select('+senha');

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario não encontrado!' });
      }
      if (!secret) {
        return res.status(500).json({ message: 'Segredo não definido!' });
      }
      const token = jwt.sign({ id: usuario._id }, secret, {
        expiresIn: '1h'
      });
      if (!await bcrypt.compare(senha, usuario.senha)) {
        return res.status(400).json({ message: 'Usuario ou senha invalida!' });
      }
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({message: 'Erro Interno no Servidor!'});
    }
  }
}