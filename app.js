require('dotenv').config();
require('express-async-errors');
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

// extra packages
app.use(express.json());

// routes
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
