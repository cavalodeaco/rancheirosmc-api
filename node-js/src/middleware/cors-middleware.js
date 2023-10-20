module.exports = (req, res, next) => {
  console.info("Cors Middleware");
  // var allowlist = [
  //   "https://www.rancheirosmc.com.br",
  //   "https://rancheirosmc.com.br",
  //   "https://mpv.rancheirosmc.com.br",
  //   "https://admin.rancheirosmc.com.br",
  // ];
  // if (process.env.ENV === "production") {
  //   if (allowlist.indexOf(req.header("Origin")) !== -1) {
  //     res.header("Access-Control-Allow-Origin", req.header("Origin"));
  //     res.header(
  //       "Access-Control-Allow-Headers",
  //       "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization,limit,page,access_token,id_token,filter"
  //     );
  //     res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  //     res.header("Access-Control-Allow-Credentials", "false");
  //   } else {
  //     throw new Error("CORS Error: invalid origin");
  //   }
  // } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization, limit,page,access_token,id_token,filter"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "false");
  // }
  return next();
};
