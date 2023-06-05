const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const { signinUser } = require('../controllers/users');

router.post('/signin', signinUser);

module.exports = router;
