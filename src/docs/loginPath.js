const loginPath = {
    "/login": {
        post: {
            tags: ["Login"],
            summary: "Realiza o login do usuário",
            description: "Endpoint utilizado para autenticar um usuário com o email e senha fornecidos.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: { 
                                    type: "string", 
                                    format: "email", 
                                    example: "alx.delira@gmail.com",
                                    description: "Endereço de email do usuário."
                                },
                                senha: { 
                                    type: "string", 
                                    example: "12345678",
                                    description: "Senha do usuário."
                                }
                            },
                            required: ["email", "senha"]
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Login realizado com sucesso",
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          properties: {
                            token: {
                              type: "string",
                              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                              description: "Token JWT gerado para autenticação."
                            },
                            usuario: {
                              type: "object",
                              properties: {
                                nome: {
                                  type: "string",
                                  example: "Alexandre Delira",
                                },
                                email: {
                                  type: "string",
                                  format: "email",
                                  example: "alx.delira@gmail.com",
                                },
                                foto: {
                                  type: "string",
                                  format: "binary",
                                  example: "66c65949f2ad1387602faf4f",
                                  description: "Id da foto do usuário."
                                }
                              },
                              required: ["nome", "email", "foto"]
                            },
                          },
                          required: ["token", "usuario"]
                        },
                      },
                    },
                  },
                400: {
                    description: "Usuário ou senha inválidos",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { 
                                        type: "string", 
                                        example: "Usuário ou senha inválidos.",
                                        description: "Mensagem informando que as credenciais fornecidas são inválidas."
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Usuário não encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { 
                                        type: "string", 
                                        example: "Usuário não encontrado. Verifique se o email está correto ou registre-se para criar uma conta.",
                                        description: "Mensagem informando que o usuário não foi encontrado."
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Erro interno no servidor",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { 
                                        type: "string", 
                                        example: "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.",
                                        description: "Mensagem informando que ocorreu um erro interno no servidor."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export default loginPath;
