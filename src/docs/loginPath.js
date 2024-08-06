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
                                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFseC5kZWxpcmFAZ21haWwuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.S9lZ1Zk7hB7h0OFKp6Dapwu4o3x_QSTgW4a5E8IdEWI",
                                        description: "Token JWT gerado para autenticação."
                                    },
                                    usuario: {
                                        type: "object",
                                        properties: {
                                            nome: { 
                                                type: "string", 
                                                example: "Alexandre Delira",
                                                description: "Nome do usuário autenticado."
                                            },
                                            email: { 
                                                type: "string", 
                                                format: "email", 
                                                example: "alx.delira@gmail.com",
                                                description: "Email do usuário autenticado."
                                            },
                                            foto: { 
                                                type: "string", 
                                                format: "url", 
                                                example: "https://example.com/foto.jpg",
                                                description: "URL da foto de perfil do usuário, se cadastrada."
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
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
