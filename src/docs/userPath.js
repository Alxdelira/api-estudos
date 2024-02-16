const userPath = {
    "/usuarios": {
        post: {
            tags: ["Usuarios"],
            summary: "Cria um novo usuário",
            description: "Cria um novo usuário com os dados fornecidos",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                nome: { type: "string" },
                                email: { type: "string" },
                                senha: { type: "string" },
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
                                    message: { type: "string" },
                                    novoUsuario: { type: "object" } 
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
                                    error: { type: "number" },
                                    message: { type: "string" }
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
                                    error: { type: "number" },
                                    message: { type: "string" }
                                }
                            }
                        }
                    }
                }
            }
        },
        get: {
            tags: ["Usuarios"],
            summary: "Lista todos os usuários do sistema",
            description: "Retorna uma lista de todos os usuários cadastrados e suas respectivas informações",
            responses: {
                200: {
                    description: "Lista de usuários retornada com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object", 
                                properties: {
                                    docs: { type: "array" }, 
                                    totalDocs: { type: "number" },
                                    totalPages: { type: "number" },
                                    page: { type: "number" },
                                    pagingCounter: { type: "number" },
                                    hasPrevPage: { type: "boolean" },
                                    hasNextPage: { type: "boolean" }
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
                                    error: { type: "number" },
                                    message: { type: "string" }
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
                                    error: { type: "number" },
                                    message: { type: "string" }
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
            tags: ["Usuarios"],
            summary: "Obtém informações de um usuário por ID",
            description: "Retorna as informações de um usuário específico com base em seu ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário a ser consultado",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Informações do usuário retornadas com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object" // Especifique o schema do objeto retornado pelo endpoint
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
                                    error: { type: "number" },
                                    message: { type: "string" }
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
                                    error: { type: "number" },
                                    message: { type: "string" }
                                }
                            }
                        }
                    }
                }
            }
        },
        put: {
            tags: ["Usuarios"],
            summary: "Atualiza as informações de um usuário por ID",
            description: "Atualiza as informações de um usuário específico com base em seu ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário a ser atualizado",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object", // Especifique o schema do objeto enviado no corpo da requisição
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
                                    message: { type: "string" },
                                    usuarioAtualizado: { type: "object" } 
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
                                    error: { type: "number" },
                                    message: { type: "string" }
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
                                    error: { type: "number" },
                                    message: { type: "string" }
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
                                    error: { type: "number" },
                                    message: { type: "string" }
                                }
                            }
                        }
                    }
                }
            }
        },
        delete: {
            tags: ["Usuarios"],
            summary: "Deleta um usuário por ID",
            description: "Deleta um usuário específico com base em seu ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID do usuário a ser deletado",
                    required: true,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                200: {
                    description: "Usuário deletado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string" },
                                    usuarioDeletado: { type: "object" } 
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
                                    error: { type: "number" },
                                    message: { type: "string" }
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
                                    error: { type: "number" },
                                    message: { type: "string" }
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
