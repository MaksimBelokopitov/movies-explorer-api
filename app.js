require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUserValidation, loginValidation } = require('./middlewares/userValidation');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const limiter = require('./utils/limiter')

const { PORT, DB } = process.env;
const { login, createUsers } = require('./controllers/users');
const router = require('./routes/index')

const app = express();
app.use(cors);
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(limiter)

app.post('/signup', createUserValidation, createUsers);
app.post('/signin', loginValidation, login);
app.use(auth);
app.use(router);
app.post('/signout', (req, res, next)=> {
  res.clearCookie('jwt');
  next();
})

app.use(errorLogger);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
  next();
});
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`DB connection error ${err}`));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
