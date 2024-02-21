const router = require('express').Router();
const { createUserValidation, loginValidation } = require('../middlewares/userValidation');
const { login, createUsers } = require('../controllers/users');

router.post('/signup', createUserValidation, createUsers);
router.post('/signin', loginValidation, login);

module.exports = router;
