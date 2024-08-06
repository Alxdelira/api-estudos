import userPath from './userPath.js';
import loginPath from './loginPath.js';
import imagePath from './imagePath.js';
import * as dotenv from 'dotenv';

dotenv.config();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Estudos',
      description: 'Este projeto visa testar autenticação e integração com outros aplicativos e projetos, fornecendo um ponto de partida para estudos e experimentação com APIs.',
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
        url: 'http://localhost:3030/',
        description: 'Ambiente de Desenvolvimento Local',
      },
      {
        url: 'https://api-estudos.vercel.app/',
        description: 'Ambiente de Produção',
      },
    ],
    components: {
      securitySchemes: {
        jwtAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Autenticação baseada em JWT. Inclua um token JWT válido no cabeçalho de autorização usando o esquema Bearer.',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Credenciais inválidas ou falta de autorização.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  codigo: {
                    type: 'number',
                    example: 401,
                  },
                  mensagem: {
                    type: 'string',
                    example: 'Usuário não autorizado.',
                  },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: 'Acesso negado ao recurso solicitado.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  codigo: {
                    type: 'number',
                    example: 403,
                  },
                  mensagem: {
                    type: 'string',
                    example: 'Você não tem permissão para acessar este recurso.',
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: 'O recurso solicitado não foi encontrado.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  codigo: {
                    type: 'number',
                    example: 404,
                  },
                  mensagem: {
                    type: 'string',
                    example: 'Recurso não encontrado.',
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Erro interno no servidor.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  codigo: {
                    type: 'number',
                    example: 500,
                  },
                  mensagem: {
                    type: 'string',
                    example: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.',
                  },
                },
              },
            },
          },
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
        description: 'Operações relacionadas ao processo de autenticação e login.',
      },
      {
        name: 'Usuários',
        description: 'Operações para gerenciamento de usuários, incluindo criação, atualização e exclusão.',
      },
      {
        name: 'Imagens',
        description: 'Operações para o upload, recuperação e exclusão de imagens.',
      },
    ],
    paths: { ...userPath, ...loginPath, ...imagePath },
  },
  apis: ['./src/router/*.js'],
};

export default swaggerOptions;
