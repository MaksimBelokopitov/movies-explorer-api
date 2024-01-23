const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const UserRulesErrors = require('../errors/UserRulesError');
const {
  badRequest,
  userRulesError,
  deleteOk,
  notFoundErrorMovie,
} = require('../utils/constants');

module.exports.getAllMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner,
    movieId,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(badRequest));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        next(new UserRulesErrors(userRulesError));
      } else {
        movie.deleteOne(movie)
          .then(() => {
            res.status(200).send({ message: deleteOk });
          });
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError(notFoundErrorMovie));
      } else if (err.name === 'CastError') {
        next(new BadRequest(badRequest));
      } else {
        next(err);
      }
    });
};
