const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      require: [true, 'незаполнено поле name'],
    },
    email: {
      type: String,
      require: [true, 'незаполнено поле email'],
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Неправильный адрес почты',
      },
    },
    password: {
      type: String,
      required: [true, 'незаполнено поле password'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject((new AuthError('Неправильные почта или пароль')));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
