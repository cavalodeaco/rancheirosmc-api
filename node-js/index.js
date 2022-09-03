const app = require("./src/app");
const dynamoose = require("dynamoose");
require('dotenv').config()

dynamoose.aws.ddb.local();

app.listen(3000, () => console.log('I hear you, on http://localhost:3000'))