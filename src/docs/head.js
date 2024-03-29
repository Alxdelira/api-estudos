import userPath from './userPath.js';
import loginPath from './loginPath.js';
import imagePath from './imagePath.js';
import * as dotenv from 'dotenv';

dotenv.config();

const  swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de  Estudos',
      description: 'Projeto feito para um testar login com outros aplicativos e projetos!',
      version: '1.1.0',
      contact: {
        name: "Alexandre Nogueira",
        email: "alx.delira@gmail.com",
        url: "https://portfolioalxdelira.vercel.app/",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url:'https://api-estudos.vercel.app/',
        description: 'Api para Estudos - Local',
      },
      {
        url: 'https://alexandre-3031.code.fslab.dev/',
        description: 'Api para Estudos - Code FsLab',
      },
      {
        url: 'https://alexandre-3030.vercel.app',
        description: 'Api para Estudos - Vercel',
      },
    ],
    components: {
      securitySchemes: {
        jwtAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        jwtAuth: [],
      },
    ],

    tags: [
      {
        name: 'Login',
        description: 'Operações para rota de Login',
      },
      {
        name: 'Usuarios',
        description: 'Operações para rota de Login',
      },
      {
        name: 'Imagens',
        description: 'Operações para rota de Imagens',
      }
    ],
    paths: {...userPath, ...loginPath,...imagePath},
  },
  apis: ['./src/router/*.js'],
};



export default  swaggerOptions;