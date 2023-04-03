module.exports = (err, req, res, next) => {
  console.info("Error middleware");
  console.error(err);
  console.error(JSON.stringify(err));
  console.info("-----------------");
  const status = err.status || err.statusCode || 500;
  return res.status(status).json(err.message);
};
