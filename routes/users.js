const router = require('express').Router();

const { getUser, updateUser } = require('../controllers/users');

router.get('/', getUser);
router.patch('/me', updateUser);

module.exports = router;
