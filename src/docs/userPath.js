const userPath = {
    "/usuarios": {
        post: {
            tags: ["Usuários"],
            summary: "Cria um novo usuário",
            description: "Endpoint para criar um novo usuário com os dados fornecidos.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                nome: { type: "string", example: "João da Silva" },
                                email: { type: "string", format: "email", example: "joao@example.com" },
                                senha: { type: "string", example: "senha123" },
                                foto: { type: "string", format: "url", example: "https://example.com/foto.jpg" }
                            },
                            required: ["nome", "email", "senha"]
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "Usuário criado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Novo usuário criado com sucesso!" },
                                    novoUsuario: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "5f0a2e6ac163b613a0555c14" },
                                            nome: { type: "string", example: "João da Silva" },
                                            email: { type: "string", format: "email", example: "joao@example.com" },
                                            foto: { type: "string", format: "url", example: "https://example.com/foto.jpg" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Dados obrigatórios faltando ou inválidos",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    error: { type: "number", example: 400 },
                                    message: { type: "string", example: "Preencha todos os campos obrigatórios." }
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
                                    error: { type: "number", example: 500 },
                                    message: { type: "string", example: "Erro interno no servidor. Por favor, tente novamente mais tarde." }
                                }
                            }
                        }
                    }
                }
            }
        },
        get: {
            tags: ["Usuários"],
            summary: "Lista todos os usuários",
            description: "Endpoint para listar todos os usuários cadastrados.",
            parameters: [
                {
                    name: "nome",
                    in: "query",
                    description: "Nome do usuário para busca",
                    required: false,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "email",
                    in: "query",
                    description: "Email do usuário para busca",
                    required: false,
                    schema: {
                        type: "string",
                    }
                },
                {
                    name: "page",
                    in: "query",
                    description: "Número da página",
                    required: false,
                    schema: {
                        type: "number",
                        example: 1
                    }
                },
                {
                    name: "perPage",
                    in: "query",
                    description: "Número de itens por página",
                    required: false,
                    schema: {
                        type: "number",
                        example: 10
                    }
                }
            ],
            responses: {
                200: {
                    description: "Lista de usuários retornada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    docs: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string", example: "5f0a2e6ac163b613a0555c14" },
                                                nome: { type: "string", example: "João da Silva" },
                                                email: { type: "string", format: "email", example: "joao@example.com" },
                                                foto: { type: "string", format: "url", example: "https://example.com/foto.jpg" }
                                            }
                                        }
                                    },
                                    totalDocs: { type: "number", example: 2 },
                                    totalPages: { type: "number", example: 1 },
                                    page: { type: "number", example: 1 },
                                    pagingCounter: { type: "number", example: 1 },
                                    hasPrevPage: { type: "boolean", example: false },
                                    hasNextPage: { type: "boolean", example: false }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Nenhum usuário encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    error: { type: "number", example: 404 },
                                    message: { type: "string", example: "Nenhum usuário encontrado." }
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
                                    error: { type: "number", example: 500 },
                                    message: { type: "string", example: "Erro interno no servidor. Por favor, tente novamente mais tarde." }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/usuarios/{id}": {
        get: {
            tags: ["Usuários"],
            summary: "Obtém informações de um usuário por ID",
            description: "Endpoint para obter informações de um usuário específico com base em seu ID.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário a ser consultado",
                    required: true,
                    schema: {
                        type: "string",
                    }
                }
            ],
            responses: {
                200: {
                    description: "Informações do usuário retornadas com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    _id: { type: "string", example: "5f0a2e6ac163b613a0555c14" },
                                    nome: { type: "string", example: "João da Silva" },
                                    email: { type: "string", format: "email", example: "joao@example.com" },
                                    foto: { type: "string", format: "url", example: "https://example.com/foto.jpg" }
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
                                    error: { type: "number", example: 404 },
                                    message: { type: "string", example: "Usuário não encontrado." }
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
                                    error: { type: "number", example: 500 },
                                    message: { type: "string", example: "Erro interno no servidor. Por favor, tente novamente mais tarde." }
                                }
                            }
                        }
                    }
                }
            }
        },
        put: {
            tags: ["Usuários"],
            summary: "Atualiza informações de um usuário por ID",
            description: "Endpoint para atualizar informações de um usuário específico com base em seu ID.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário a ser atualizado",
                    required: true,
                    schema: {
                        type: "string",
                        example: "5f0a2e6ac163b613a0555c14"
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                nome: { type: "string", example: "Novo Nome" },
                                email: { type: "string", format: "email", example: "novoemail@example.com" },
                                senha: { type: "string", example: "novaSenha123" },
                                foto: { type: "string", format: "url", example: "https://example.com/nova-foto.jpg" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Usuário atualizado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Usuário atualizado com sucesso!" },
                                    usuarioAtualizado: {
                                        type: "object",
                                        properties: {
                                            _id: { type: "string", example: "5f0a2e6ac163b613a0555c14" },
                                            nome: { type: "string", example: "Novo Nome" },
                                            email: { type: "string", format: "email", example: "novoemail@example.com" },
                                            foto: { type: "string", format: "url", example: "https://example.com/nova-foto.jpg" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Dados obrigatórios faltando ou inválidos",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    error: { type: "number", example: 400 },
                                    message: { type: "string", example: "Por favor, preencha todos os campos obrigatórios." }
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
                                    error: { type: "number", example: 404 },
                                    message: { type: "string", example: "Usuário não encontrado." }
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
                                    error: { type: "number", example: 500 },
                                    message: { type: "string", example: "Erro interno no servidor. Por favor, tente novamente mais tarde." }
                                }
                            }
                        }
                    }
                }
            }
        },
        delete: {
            tags: ["Usuários"],
            summary: "Deleta um usuário por ID",
            description: "Endpoint para deletar um usuário específico com base em seu ID.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário a ser deletado",
                    required: true,
                    schema: {
                        type: "string",
                        example: "5f0a2e6ac163b613a0555c14"
                    }
                }
            ],
            responses: {
                204: {
                    description: "Usuário deletado com sucesso",
                    content: {}
                },
                404: {
                    description: "Usuário não encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    error: { type: "number", example: 404 },
                                    message: { type: "string", example: "Usuário não encontrado." }
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
                                    error: { type: "number", example: 500 },
                                    message: { type: "string", example: "Erro interno no servidor. Por favor, tente novamente mais tarde." }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/dashboard": {
        get: {
            tags: ["Dashboard"],
            summary: "Obtém o total de usuários cadastrados",
            description: "Endpoint para obter o total de usuários cadastrados na base de dados.",
            responses: {
                200: {
                    description: "Total de usuários retornado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    totalUsuarios: { type: "number", example: 100 }
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
                                    error: { type: "number", example: 500 },
                                    message: { type: "string", example: "Erro interno no servidor. Por favor, tente novamente mais tarde." }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export default userPath;
