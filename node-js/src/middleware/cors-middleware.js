
export default (err, req, res, next) => {
    console.log("Cors Middleware");
    if (process.env.ENV === 'production') {
        res.header('Access-Control-Allow-Origin', 'https://lordriders.com');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization,limit,page,access_token,id_token');
        res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'false');
        next();
    } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization, limit,page,access_token,id_token');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'false');
        next();
    }
}