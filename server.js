import app from "./src/app.js";
import * as dotenv from "dotenv";
import swaggerUI from 'swagger-ui-express'; 
import swaggerJsDoc from 'swagger-jsdoc';  
import swaggerOptions from './src/docs/head.js'; 

// Carregar variáveis de ambiente
dotenv.config();

// Configurações
const port = process.env.PORT || 3000;
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.7/swagger-ui.min.css";

// Configura a documentação Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware para a documentação Swagger
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, { customCssUrl: CSS_URL }));

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor Rodando em http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Erro ao iniciar o servidor:', err);
});
