export default (err, req, res, next) => {
    console.error(err);
    if (err.status) {
        return res.status(err.status).json(err.message);
    }
    return res.status(500).json({ error: err.message });
}