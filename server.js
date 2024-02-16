import app from "./src/app.js"
import * as dotenv from "dotenv"
import swaggerUI from 'swagger-ui-express'; 
import swaggerJsDoc from 'swagger-jsdoc';  
import swaggerOptions from './src/docs/head.js'; 


dotenv.config()

const port = process.env.PORT || 3000;

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


app.listen(port, () => console.log(`Servidor Rodando em http://localhost:${port}`));
