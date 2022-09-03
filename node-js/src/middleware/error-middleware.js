export default (err, req, res, next) => {
    console.error(err);
    if (err.code && err.status) {
        return res.status(err.status).json({ error: err.message, code: err.code });
    }
    return res.status(500).json({ error: err.message });
}