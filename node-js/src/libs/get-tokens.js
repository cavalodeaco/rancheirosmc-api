const jwt = require('jsonwebtoken');

const getIdToken = (header) => {
    // get tokens from header
    const id_token = process.env.ENV == "local" ? JSON.parse(process.env.TOKENS)["id_token"] : header.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
        throw CreateError[401]({ message: 'Not a valid Id JWT token' });
    }
    return decodedIdJwt.payload;
}

module.exports = getIdToken;