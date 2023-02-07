import LoginService from '../../service/login/login-service.js';

const LoginController = {
    doLogin: async (req, res, next) => {
        try {
            const service = new LoginService();
            const data = await service.getToken(req.body);
            if (data.access_token === undefined || data.id_token === undefined || data.refresh_token === undefined || data.access_token === null || data.id_token === null || data.refresh_token === null) {
                throw {status:500, message:"No token found"};
            }
            res.status(200).json({message:data});
        } catch (err) {
            next(err);
        }
    }
}

export default LoginController;