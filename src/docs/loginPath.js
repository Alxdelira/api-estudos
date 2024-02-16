const loginPath = {
    "/login": {
        post: {
            tags: ["Login"],
            summary: "Realiza o login do usuário",
            description: "Realiza o login do usuário com o email e senha fornecidos",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: { type: "string" },
                                senha: { type: "string" },
                            },
                            example: { 
                                email: "alx.delira@gmail.com",
                                senha: "12345678"
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
                                    token: { type: "string" }
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

export default loginPath;