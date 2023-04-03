module.exports = (req, res, next) => {
  console.info("Log Middleware");
  console.info("req.method: " + req.method);
  console.info("req.body: " + JSON.stringify(req.body));
  next();
};
