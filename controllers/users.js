const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { NODE_ENV, JWT_SECRET } = require('../config');
const User = require('../models/user');
const AccountUsed = require('../error/account-used');
const PageNotFound = require('../error/page-not-found');
const IncorrectData = require('../error/incorrect-data');

module.exports.getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (user) return res.send({ email: user.email, name: user.name });
      throw new PageNotFound('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new IncorrectData('Передан некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.signupUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.status(201).send({ email: user.email, name: user.name, _id: user._id });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new AccountUsed('Аккаунт с этой почтой уже существует'));
      } if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectData('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.signinUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'asdf', { expiresIn: '7d' });
      res.status(200).send({ token, message: 'Авторизация прошла успешна' });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const { _id: idUser } = req.user;

  User.findByIdAndUpdate(idUser, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.send(user);
      throw new PageNotFound('Пользователь по указанному id не найден');
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new AccountUsed('Аккаунт с этой почтой уже существует'));
      }

      if (err instanceof mongoose.Error.CastError) {
        return next(new IncorrectData('Передан некорректный id пользователя'));
      }

      if (err instanceof mongoose.Error.ValidationError) {
        return next(new IncorrectData('Переданы некорректные данные при обновлении пользователя'));
      }

      return next(err);
    });
};
