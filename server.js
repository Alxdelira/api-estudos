import app from "./src/app.js";
import * as dotenv from "dotenv";
import swaggerUI from 'swagger-ui-express'; 
import swaggerJsDoc from 'swagger-jsdoc';  
import swaggerOptions from './src/docs/head.js'; 

dotenv.config();

const port = process.env.PORT || 3000;

// Defina o URL do CSS do Swagger UI
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.7/swagger-ui.min.css";

// Defina as opções do Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Configure o Swagger UI Express
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, { customCssUrl: CSS_URL }));

// Inicie o servidor
app.listen(port, () => console.log(`Servidor Rodando em http://localhost:${port}`));
