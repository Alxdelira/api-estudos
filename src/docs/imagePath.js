const imagePath = {
    "/imagens": {
        get: {
            tags: ["Imagens"],
            summary: "Lista todas as imagens",
            description: "Recupera todas as imagens armazenadas no sistema.",
            responses: {
                200: {
                    description: "Listagem de imagens bem-sucedida",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        tipo_arquivo: {
                                            type: "string",
                                            description: "Tipo do arquivo da imagem.",
                                        },
                                        enviado_por: {
                                            type: "string",
                                            description: "ID do usuário que enviou a imagem.",
                                        },
                                        caminho: {
                                            type: "string",
                                            description: "Caminho onde a imagem está armazenada.",
                                        },
                                        id_imagem: {
                                            type: "string",
                                            description: "ID da imagem.",
                                        },
                                        criado_em: {
                                            type: "string",
                                            format: "date-time",
                                            description: "Data e hora em que a imagem foi criada.",
                                        },
                                        atualizado_em: {
                                            type: "string",
                                            format: "date-time",
                                            description: "Data e hora da última atualização da imagem.",
                                        },
                                        _id: {
                                            type: "string",
                                            description: "ID interno do MongoDB.",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "Erro interno do servidor",
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
                                        example: "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        post: {
            tags: ["Imagens"],
            summary: "Envia uma imagem",
            description: "Envia uma nova imagem para o servidor.",
            requestBody: {
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                image: {
                                    type: "string",
                                    format: "binary",
                                    description: "Arquivo da imagem a ser enviado.",
                                },
                            },
                            required: ["image"],
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Imagem enviada com sucesso",
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
                                        example: "Imagem enviada com sucesso",
                                    },
                                    dados: {
                                        type: "object",
                                        properties: {
                                            tipo_arquivo: {
                                                type: "string",
                                                description: "Tipo do arquivo da imagem.",
                                            },
                                            enviado_por: {
                                                type: "string",
                                                description: "ID do usuário que enviou a imagem.",
                                            },
                                            caminho: {
                                                type: "string",
                                                description: "Caminho onde a imagem está armazenada.",
                                            },
                                            id_imagem: {
                                                type: "string",
                                                description: "ID da imagem.",
                                            },
                                            criado_em: {
                                                type: "string",
                                                format: "date-time",
                                                description: "Data e hora em que a imagem foi criada.",
                                            },
                                            atualizado_em: {
                                                type: "string",
                                                format: "date-time",
                                                description: "Data e hora da última atualização da imagem.",
                                            },
                                            _id: {
                                                type: "string",
                                                description: "ID interno do MongoDB.",
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
                                        example: "Nenhum arquivo enviado ou formato inválido.",
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: "Não autorizado",
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
                                        example: "Usuário não autenticado.",
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "Erro interno do servidor",
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
                                        example: "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    "/imagens/{id}": {
        delete: {
            tags: ["Imagens"],
            summary: "Deleta uma imagem",
            description: "Remove a imagem com o ID especificado do servidor.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID da imagem a ser deletada.",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                204: {
                    description: "Imagem deletada com sucesso",
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
                                        example: "Imagem deletada com sucesso",
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: "Não autorizado",
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
                                        example: "Usuário não autenticado.",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "Proibido",
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
                                        example: "Você não tem permissão para deletar esta imagem.",
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: "Imagem não encontrada",
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
                                        example: "Imagem não encontrada.",
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "Erro interno do servidor",
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
                                        example: "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        get: {
            tags: ["Imagens"],
            summary: "Recupera uma imagem pelo ID",
            description: "Recupera e exibe a imagem correspondente ao ID fornecido.",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "ID da imagem a ser recuperada.",
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Imagem recuperada com sucesso",
                    content: {
                        "application/octet-stream": {
                            schema: {
                                type: "string",
                                format: "binary",
                            },
                        },
                    },
                },
                401: {
                    description: "Não autorizado",
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
                                        example: "Usuário não autenticado.",
                                    },
                                },
                            },
                        },
                    },
                },
                403: {
                    description: "Proibido",
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
                                        example: "Você não tem permissão para acessar esta imagem.",
                                    },
                                },
                            },
                        },
                    },
                },
                404: {
                    description: "Imagem não encontrada",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    codigo: {
                                        type: "number",
                                        example: 404,
                                    },
                                    mensagem: {
                                        type: "string",
                                        example: "Imagem não encontrada.",
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "Erro interno do servidor",
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
                                        example: "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export default imagePath;
