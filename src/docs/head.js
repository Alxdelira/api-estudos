import userPath from './userPath.js';
import loginPath from './loginPath.js';

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
        url: `http://localhost:${process.env.PORT}/`,
        description: 'Api para Estudos ',
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
      }
    ],
    paths: {...userPath, ...loginPath},
  },
  apis: ['./src/router/*.js'],
};



export default  swaggerOptions;