import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { loginRoutes } from '../routers/login-routes.js';
import { enrollRoutes } from '../routers/enroll-routes.js';
import errorMiddleware from '../middleware/error-middleware.js';
import corsMiddleware from '../middleware/cors-middleware.js';
import { reportRoutes } from '../routers/report-routes.js';

const app = express()
app.use(bodyParser.json())
if (process.env.ENV === 'production') {
    var allowlist = ['https://ppv.lordriders.com', 'https://ppv-admin.lordriders.com'];
    var corsOptionsDelegate = function (req, callback) {
        var corsOptions;
        if (allowlist.indexOf(req.header('Origin')) !== -1) {
            console.log("Allowing CORS for: " + req.header('Origin'));
            corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
        } else {
            console.log("Disabling CORS for: " + req.header('Origin'));
            corsOptions = { origin: false } // disable CORS for this request
        }
        callback(null, corsOptions) // callback expects two parameters: error and options
    }
    app.use(cors(corsOptionsDelegate))
} else {
    app.use(cors());
}
app.use("/login", loginRoutes);
app.use("/enroll", enrollRoutes);
app.use("/report", reportRoutes);
app.use(corsMiddleware);
app.use(errorMiddleware);

export default app;