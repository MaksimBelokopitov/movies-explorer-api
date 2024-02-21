const router = require('express').Router();
const { createMovieValidation, movieIdValidation } = require('../middlewares/movieValidation');
const {
  getAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getAllMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
