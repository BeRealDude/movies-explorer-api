const router = require('express').Router();
const PageNotFound = require('../error/page-not-found');

const auth = require('../middlewares/auth');

const signupRoute = require('./signup');
const signinRoute = require('./signin');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');

router.use('/', signupRoute);
router.use('/', signinRoute);

router.use(auth);

router.use('/users', usersRoutes);
router.use('/movies', moviesRoutes);

router.use((req, res, next) => next(new PageNotFound('Страница не найдена')));

module.exports = router;
