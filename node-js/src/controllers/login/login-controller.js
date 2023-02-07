import LoginService from '../../service/login/login-service.js';

const LoginController = {
    doLogin: async (req, res, next) => {
        try {
            const service = new LoginService();
            const {status, data} = await service.getToken(req.body);
            res.status(status).json({message:data});
        } catch (err) {
            next(err);
        }
    }
}

export default LoginController;