const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const userToken = req.cookies.jwt;

  if (!userToken) {
    next(new AuthError('Необходима регистрация'));
  }
  let payload;

  try {
    payload = jwt.verify(userToken, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthError('Необходима регистрация.'));
  }
  req.user = payload;
  next();
};
