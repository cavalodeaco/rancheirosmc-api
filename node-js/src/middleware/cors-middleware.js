
export default (err, req, res, next) => {
    console.log("Cors Middleware");
    if (process.env.ENV === 'production') {
        res.header('Access-Control-Allow-Origin', 'https://ppv.lordriders.com, https://ppv-admin.lordriders.com');
        res.header('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,limit,page,access_token,id_token');
        res.header('Access-Control-Allow-Methods', 'GET,POST,HEAD,OPTIONS');
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