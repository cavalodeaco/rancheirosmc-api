module.exports = (req, res, next) => {
  console.info("Response Middleware");
  console.info("res.statusCode: " + res.statusCode);
  console.info("res.statusMessage: " + res.statusMessage);
  console.info("res.body: " + JSON.stringify(res.body));
  return res;
};
