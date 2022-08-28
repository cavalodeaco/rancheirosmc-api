
module.exports = (req, res, next) => {
  const { name } = req.body;
  console.log('Enroll ' + name);
  res.send({
    message: 'Not implemented yet!',
  });
};

