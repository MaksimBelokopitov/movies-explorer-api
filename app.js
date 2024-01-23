require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const limiter = require('./utils/limiter');
const router = require('./routes/index');

const { PORT, DB, NODE_ENV } = process.env;
const { pageNotFound } = require('./utils/constants');
const { MONGO_DB } = require('./utils/config');

const app = express();
app.use(cors);
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(limiter);

app.use(router);
app.use('*', (req, res, next) => {
  next(new NotFoundError(pageNotFound));
  next();
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(NODE_ENV === 'production' ? DB : MONGO_DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`DB connection error ${err}`));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
