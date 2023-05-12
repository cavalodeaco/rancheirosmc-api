module.exports = (req, res, next) => {
  console.info("Request Middleware");
  console.info("req.method: " + req.method);
  console.info("req.body: " + JSON.stringify(req.body));
  console.info("req.headers: " + JSON.stringify(req.headers));
  return next();
};
