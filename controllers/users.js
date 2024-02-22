const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const EmailError = require('../errors/EmailError');
const {
  badRequest,
  emailErrorUser,
  notFoundErrorUser,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV } = require('../utils/config');

module.exports.createUsers = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then(() => res.status(201).send({
          name, email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest(badRequest));
          } else if (err.code === 11000) {
            next(new EmailError(emailErrorUser));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      next(err);
    })
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user.toJSON());
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(notFoundErrorUser));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest(badRequest));
      } else if (err.code === 11000) {
        next(new EmailError(emailErrorUser));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: "none",
        })
        .send(user._id);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getActiveUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user.toJSON());
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(notFoundErrorUser));
      } else {
        next(err);
      }
    });
};
