const router = require('express').Router();
// const PageNotFound = require('../error/page-not-found');

const auth = require('../middlewares/auth');

const signupRoute = require('./signup');
const signinRoute = require('./signin');
const usersRoutes = require('./users');

router.use('/', signupRoute);
router.use('/', signinRoute);

router.use('/users', auth, usersRoutes);

// router.use((req, res, next) => next(new PageNotFound('Страница не найдена')));

module.exports = router;
