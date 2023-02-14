import LoginService from '../../service/login/login-service.js';

const LoginController = {
    doLogin: async (req, res, next) => {
        try {
            const service = new LoginService();
            const data = await service.getToken(req.body);
            if (!data.access_token || !data.id_token || !data.refresh_token) {
                throw {status:500, message:"No token found"};
            }
            res.status(200).json({message:data});
        } catch (err) {
            next(err);
        }
    }
}

export default LoginController;