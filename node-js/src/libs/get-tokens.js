const jwt = require("jsonwebtoken");

const getIdToken = (header) => {
  console.info("getIdToken: ");
  try {
    // get tokens from header
    const id_token =
      process.env.ENV == "local"
        ? JSON.parse(process.env.TOKENS)["id_token"]
        : header.id_token;
    let decodedIdJwt = jwt.decode(id_token, { complete: true });
    if (!decodedIdJwt) {
      throw CreateError[401]({ message: "Not a valid Id JWT token" });
    }
    return decodedIdJwt.payload;
  } catch (err) {
    throw CreateError[500]({ message: "Error to get tokens: " + JSON.stringify(err) });
  }
};

module.exports = getIdToken;
