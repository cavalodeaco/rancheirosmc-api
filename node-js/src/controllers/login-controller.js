const LoginService = require("../service/login-service.js");
const CreateError = require("http-errors");

const LoginController = {
  doLogin: async (req, res, next) => {
    console.info("LoginController.doLogin");
    try {
      if (process.env.ENV === "local")
        return res
          .status(200)
          .json({ message: JSON.parse(process.env.TOKENS) });
      const service = new LoginService();
      const data = await service.getToken(req.body);
      if (!data.access_token || !data.id_token || !data.refresh_token) {
        throw CreateError[500]({ message: "No token found}" });
      }
      res.status(200).json({ message: data });
      next();
    } catch (err) {
      throw CreateError[500]({
        message: "Error to login: " + JSON.stringify(err),
      });
    }
  },
};

module.exports = LoginController;
