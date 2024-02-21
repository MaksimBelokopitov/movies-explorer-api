const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { authError } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../utils/config');

module.exports = (req, res, next) => {
  const userToken = req.cookies.jwt;

  if (!userToken) {
    next(new AuthError(authError));
  }
  let payload;

  try {
    payload = jwt.verify(userToken, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    next(new AuthError(authError));
  }
  req.user = payload;
  next();
};
