import LoginService from '../../service/login/login-service.js';

const LoginController = {
    doLogin: async (req, res, next) => {
        try {
            const service = new LoginService();
            var loginStatus, loginData = await service.getToken(req.body);
            console.log("loginData: "+ loginData);
            let status = 500;
            switch (loginStatus) {
                case "logged": 
                    status = 200;
                    res.status(status).json({tokens: loginData});
                    break;
                default:
                    status = 401;
            }
            res.status(status).json({message: loginData});
        } catch (err) {
            next(err);
        }
    }
}

export default LoginController;