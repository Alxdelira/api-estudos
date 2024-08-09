import mongoose from 'mongoose';
import UsuarioModel from '../models/usuario.js';
import ImagemModel from '../models/image.js';
import bcrypt from 'bcrypt';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import faker from 'faker';

dotenv.config();

const SALT_ROUNDS = 8;
const NUM_USERS = 10;
const NUM_IMAGES_PER_USER = 1;

// URLs das imagens no GitHub
const IMAGE_URLS = [
  'https://avatars.githubusercontent.com/u/159805814?v=4',
  'https://avatars.githubusercontent.com/u/102405026?v=4',
  'https://avatars.githubusercontent.com/u/56495842?v=4',
  'https://avatars.githubusercontent.com/u/115853940?v=4',
  'https://avatars.githubusercontent.com/u/124941391?v=4',
  'https://avatars.githubusercontent.com/u/124940949?v=4',
  'https://avatars.githubusercontent.com/u/119544759?v=4',
  'https://avatars.githubusercontent.com/u/83317702?v=4',
  'https://avatars.githubusercontent.com/u/124743844?v=4',
  'https://avatars.githubusercontent.com/u/115584120?v=4',
];

const standardUser = {
  nome: 'Alexandre Nogueira',
  email: 'alx.delira@gmail.com',
  senha: '12345678',
  foto: null,
};

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexão estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

const sanitizeFileName = (fileName) => {
  return fileName.replace(/[<>:"/\\|?*]/g, '_');
};

const downloadImage = async (url, filePath) => {
  try {
    const response = await axios({
      url,
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      let error = null;
      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });

      writer.on('close', () => {
        if (!error) {
          resolve();
        }
      });
    });
  } catch (error) {
    throw new Error(`Erro ao baixar a imagem: ${error.message}`);
  }
};

const generateFakeImageData = async () => {
  const randomUrl = IMAGE_URLS[Math.floor(Math.random() * IMAGE_URLS.length)];
  const fileName = `${uuidv4()}.jpg`;  // Usa UUID e força a extensão .jpg
  const filePath = path.resolve('imagens', fileName);

  // Cria o diretório se não existir
  const pastaDestino = path.resolve('imagens');
  if (!fs.existsSync(pastaDestino)) {
    fs.mkdirSync(pastaDestino, { recursive: true });
  }

  // Baixar a imagem
  await downloadImage(randomUrl, filePath);

  return {
    id_imagem: uuidv4(),  // Gerar um ID único
    tipo_arquivo: 'jpg',  // Força o tipo de arquivo para jpg
    caminho: `/imagens/${fileName}`,
  };
};

const seedUsersAndImages = async () => {
  try {
    await UsuarioModel.deleteMany({});
    await ImagemModel.deleteMany({});

    const senhaHash = await bcrypt.hash(standardUser.senha, SALT_ROUNDS);

    const usuarioPadrao = await UsuarioModel.create({
      ...standardUser,
      senha: senhaHash,
    });

    for (let i = 0; i < NUM_USERS; i++) {
      const nome = faker.name.findName();
      const email = faker.internet.email();
      const senha = faker.internet.password();
      const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

      const novoUsuario = await UsuarioModel.create({
        nome,
        email,
        senha: senhaHash,
      });

      const imagensIds = [];
      for (let j = 0; j < NUM_IMAGES_PER_USER; j++) {
        const imagemData = await generateFakeImageData();
        imagemData.enviado_por = novoUsuario._id;

        const novaImagem = await ImagemModel.create(imagemData);
        imagensIds.push(novaImagem._id);
      }

      novoUsuario.foto = imagensIds[0];
      await novoUsuario.save();
    }

    // Atualiza o usuário padrão com uma imagem padrão
    const imagemPadrao = await generateFakeImageData();
    imagemPadrao.enviado_por = usuarioPadrao._id;
    const imagemCriada = await ImagemModel.create(imagemPadrao);

    usuarioPadrao.foto = imagemCriada._id;
    await usuarioPadrao.save();

    console.log('Usuários e imagens criados com sucesso.');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar o seed de usuários e imagens:', error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectToDatabase();
  await seedUsersAndImages();
};

runSeed();
