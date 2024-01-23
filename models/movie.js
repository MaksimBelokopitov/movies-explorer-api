const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'незаполнено поле country'],
    },
    director: {
      type: String,
      required: [true, 'незаполнено поле director'],
    },
    duration: {
      type: Number,
      required: [true, 'незаполнено поле duration'],
    },
    year: {
      type: String,
      required: [true, 'незаполнено поле year'],
    },
    image: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'незаполнено поле  image'],
    },
    trailerLink: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'незаполнено поле trailerLink'],
    },
    thumbnail: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'незаполнено поле thumbnail'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'незаполнено поле owner'],
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'незаполнено поле movieId'],
    },
    nameRU: {
      type: String,
      required: [true, 'незаполнено поле nameRU'],
    },
    nameEN: {
      type: String,
      required: [true, 'незаполнено поле  nameEN'],
    },
  },  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
