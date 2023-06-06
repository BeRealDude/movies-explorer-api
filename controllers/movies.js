// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies

// # удаляет сохранённый фильм по id
// DELETE /movies/_id

const mongoose = require('mongoose');
const Movie = require('../models/movie');
const PageNotFound = require('../error/page-not-found');
const IncorrectData = require('../error/incorrect-data');
const NoAccess = require('../error/no-access');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((Movies) => res.send(Movies))
    .catch(next);
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
  const { _id: idUser } = req.user;

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
    movieId,
    owner: idUser,
  })
    .then((movie) => {
      movie
        .populate('owner')
        .then(() => res.status(201).send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectData('Переданы некорректные данные при сохранении фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = async (req, res, next) => {
  const { _id: idUser } = req.user;
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) throw new PageNotFound('Фильм с указанным id не найден.');
    const { owner: movieIdowner } = movie;
    if (movieIdowner.valueOf() !== idUser) {
      throw new NoAccess('Недоступно');
    } else {
      await movie.deleteOne();
      res.send({ message: 'Фильм удален.' });
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new IncorrectData('Указан некорректный id при удалении фильма.'));
    } else { next(err); }
  }
  return true;
};
