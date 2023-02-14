export default (err, req, res, next) => {
    console.log("Error middleware");
    console.error(err);
    console.log(err.message);
    console.log("-----------------");
    const status = err.status || err.statusCode || 500;

    res.status(status).json(err.message);
}