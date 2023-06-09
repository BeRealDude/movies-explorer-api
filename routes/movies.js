const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('../utils/constants');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required().min(2).max(30),
    year: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(30),
    image: Joi.string().required().pattern(REGEX_URL),
    trailerLink: Joi.string().required().pattern(REGEX_URL),
    thumbnail: Joi.string().required().pattern(REGEX_URL),
    movieId: Joi.number().required().min(2).max(30),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
}), createMovie);

router.delete('/:movieId', deleteMovie);

module.exports = router;
