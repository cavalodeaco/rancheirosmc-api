module.exports = (req, res, next) => {
  console.log("Log Middleware");
  console.log("req.method: " + req.method);
  console.log("req.body: " + JSON.stringify(req.body));
  next();
};
