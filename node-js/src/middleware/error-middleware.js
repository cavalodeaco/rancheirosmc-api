export default (err, req, res, next) => {
    console.log("Error middleware");
    console.error(err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json(err.message);
}