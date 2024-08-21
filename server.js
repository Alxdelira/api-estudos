import app from "./src/app.js";
import * as dotenv from "dotenv";
import swaggerUI from 'swagger-ui-express'; 
import swaggerJsDoc from 'swagger-jsdoc';  
import swaggerOptions from './src/docs/head.js'; 

// Carregar variáveis de ambiente
dotenv.config();

// Configura a documentação Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware para a documentação Swagger
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Inicializa o servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Erro ao iniciar o servidor:', err);
});
