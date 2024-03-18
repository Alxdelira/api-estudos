// Arquivo responsável por documentar as rotas de imagens

const imagePath = {
    "/imagens": {
        get: {
            tags: ["Imagens"],
            summary: "Lista todas as imagens",
            responses: {
                200: {
                    description: "Sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        tipo_arquivo: {
                                            type: "string",
                                        },
                                        enviado_por: {
                                            type: "string",
                                        },
                                        caminho: {
                                            type: "string",
                                        },
                                        id_imagem: {
                                            type: "string",
                                        },
                                        criado_em: {
                                            type: "string",
                                            format: "date-time",
                                        },
                                        atualizado_em: {
                                            type: "string",
                                            format: "date-time",
                                        },
                                        _id: {
                                            type: "string",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: "Não autorizado",
                },
                403: {
                    description: "Proibido",
                },
                500: {
                    description: "Erro no servidor",
                },
            },
        },
        post: {
            tags: ["Imagens"],
            summary: "Envia uma imagem",
            requestBody: {
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                image: {
                                    type: "string",
                                    format: "binary",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    codigo: {
                                        type: "number",
                                    },
                                    mensagem: {
                                        type: "string",
                                    },
                                    dados: {
                                        type: "object",
                                        properties: {
                                            tipo_arquivo: {
                                                type: "string",
                                            },
                                            enviado_por: {
                                                type: "string",
                                            },
                                            caminho: {
                                                type: "string",
                                            },
                                            id_imagem: {
                                                type: "string",
                                            },
                                            criado_em: {
                                                type: "string",
                                                format: "date-time",
                                            },
                                            atualizado_em: {
                                                type: "string",
                                                format: "date-time",
                                            },
                                            _id: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: "Arquivo inválido",
                },
                401: {
                    description: "Não autorizado",
                },
                403: {
                    description: "Proibido",
                },
                500: {
                    description: "Erro no servidor",
                },
            },
        },
    }, 
    "/imagens/{id}": {
        delete: {
            tags: ["Imagens"],
            summary: "Deleta uma imagem",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Id da imagem que vai ser deletada",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Sucesso",
                },
                401: {
                    description: "Não autorizado",
                },
                403: {
                    description: "Proibido",
                },
                404: {
                    description: "Não encontrado",
                },
                500: {
                    description: "Erro no servidor",
                },
            },
        },
        get: {
            tags: ["Imagens"],
            summary: "Recupera uma imagem pelo ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Id da imagem que vai ser exibida",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Sucesso",
                    content: {
                        image: {
                            schema: {
                                type: "string",
                                format: "binary",
                            },
                        },
                    },
                },
                401: {
                    description: "Não autorizado",
                },
                403: {
                    description: "Proibido",
                },
                404: {
                    description: "Não encontrado",
                },
                500: {
                    description: "Erro no servidor",
                },
            },
        },
    },


};

export default imagePath;