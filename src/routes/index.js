import usuarios from "./usuarioRouter.js"
import login from "./loginRouter.js"
import imagens from "./imageRouter.js";


const routes = (app) => {
    app.route("/").get((req, res) => {
        res.status(200).redirect("/docs")
    });

    app.use(
        usuarios,
        login, 
        imagens
    );
};

export default routes;