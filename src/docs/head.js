import userPath from './userPath.js';
import loginPath from './loginPath.js';
import imagePath from './imagePath.js';

const  swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de  Estudos',
      description: 'Projeto feito para um testar login com outros aplicativos e projetos!',
      version: '1.0.0',
      contact: {
        name: "Alexandre Nogueira",
        email: "alx.delira@gmail.com",
        url: "https://portfolioalxdelira.vercel.app/",
      },
    },
    servers: [
      {
        url: `https://api-estudos.vercel.app/`,
        description: 'Api para Estudos ',
      },
      {
        url: `http://localhost:3030/`,
        description: 'Api para Estudos - Local ',
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