require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const express = require("express");

const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


const app = express();


app.use(express.json());

const connectDB = require("./db/connect");

const authenticationUser = require("./middleware/authentication");

const authRouter = require("./routes/auth");
const TasksRouter = require("./routes/Tasks");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// extra packages
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}))
app.use(helmet())
app.use(cors());
app.use(xss())


// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", authenticationUser, TasksRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
