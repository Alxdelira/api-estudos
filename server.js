import app from "./src/app.js";
import * as dotenv from "dotenv";
import swaggerUI from 'swagger-ui-express'; 
import swaggerJsDoc from 'swagger-jsdoc';  
import swaggerOptions from './src/docs/head.js'; 

dotenv.config();

const port = process.env.PORT || 3000;

// Defina as opções do Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Configure o Swagger UI Express
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Inicie o servidor
app.listen(port, () => console.log(`Servidor Rodando em http://localhost:${port}`));
