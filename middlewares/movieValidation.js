const { celebrate, Joi } = require('celebrate');

const linkReg = /^(https?:\/\/)?[\w-]{1,30}\.([\w]{1,30}[^\s@]*$)/m;

module.exports.createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkReg),
    trailerLink: Joi.string().required().pattern(linkReg),
    thumbnail: Joi.string().required().pattern(linkReg),
    movieId: Joi.string().alphanum().length(24).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.movieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).required(),
  }),
});
