// advance Load for file
require('dotenv').config();
require('express-async-errors');

// Extra security Packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
// -> package name is 'express-rate-limiter'
const rateLimiter = require('express-rate-limit')

// Express Loading 
const express = require('express');
const app = express();

// Authorization MiddleWare
const authorizeUser = require('./middleware/authentication')

// connectDB
const dbConnect =  require('./db/connect')

// Routers
const jobRouter = require('./routes/jobs')
const authRouter = require('./routes/auth')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages + Security Packages
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 100,   // Limit each Ip to 100 Request per Window
  })
)
/** The Above code is Explained here...... dont get confused
 * 1. Imagine your Node.js application is hosted on a cloud platform behind a load balancer or a proxy server like Nginx.
 * 2. Requests from clients reach the load balancer/proxy first, which then forwards them to your Node.js application.
 * 3. Without app.set('trust proxy', 1);, your application might see all requests coming from the load balancer/proxy's IP address.
 * 4. By setting app.set('trust proxy', 1);, Express will look at the headers (X-Forwarded-For, etc.) to find out the actual client's IP address as forwarded by the proxy.
 */
app.use(express.json());
app.use(helmet())  // secure http Headers
app.use(cors())    // allow frontend from any domain or computer to access the API 
app.use(xss())     // sanatize the req.{body, params, query} from Cross Site Scripting

// routes
app.get('/', (req, res) => {
  res.send("Job API App Is working")
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authorizeUser, jobRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await dbConnect(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
