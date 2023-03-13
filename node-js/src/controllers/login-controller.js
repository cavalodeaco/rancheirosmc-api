import LoginService from '../service/login-service.js';
import CreateError from 'http-errors';

const LoginController = {
    doLogin: async (req, res, next) => {
        console.log("LoginController.doLogin() called");
        if (process.env.ENV == "local")
            res.status(200).json({message:JSON.parse(process.env.TOKENS)});
        try {
            const service = new LoginService();
            const data = await service.getToken(req.body);
            if (!data.access_token || !data.id_token || !data.refresh_token) {
                throw CreateError[500]({message:'No token found}'});
            }
            res.status(200).json({message:data});
        } catch (err) {
            next(err);
        }
    }
}

export default LoginController;