export default (err, req, res, next) => {
    console.error(err);
    const status = err.status || err.statusCode || 500;
    return res.status(status).json(err.message);
}