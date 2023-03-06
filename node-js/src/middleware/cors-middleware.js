
export default (err, req, res, next) => {
    console.log("Cors Middleware");
    if (process.env.NODE_ENV === 'production') {
        res.header('Access-Control-Allow-Origin', 'https://ppv.lordriders.com, https://ppv-admin.lordriders.com');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, id_token, access_token');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, id_token, access_token');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    }
}