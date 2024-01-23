const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const EmailError = require('../errors/EmailError');

const { NODE_ENV, JWT_SECRET } = process.env;

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
            next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
          } else if (err.code === 11000) {
            next(new EmailError('Пользователь с указанным почтой уже существует'));
          } else {
            next(err);
          }
        });
    });
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
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
        return;
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные '));
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
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
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
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};
