import usuarios from "./usuarioRouter.js"
import login from "./loginRouter.js"
import uploads from "./imageRouter.js"


const routes = (app) => {
    app.route("/").get((req, res) => {
        res.status(200).redirect("/docs")
    });

    app.use(
        usuarios,
        login, 
        uploads
    );
};

export default routes;