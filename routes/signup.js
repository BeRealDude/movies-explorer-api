const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { signupUser } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
  }),
}), signupUser);

module.exports = router;
