const router = require('express').Router();
const movieRouter = require('./movies');
const userRouter = require('./users');
const authorizationRouter = require('./authorization');
const auth = require('../middlewares/auth');
const { logOut } = require('../utils/constants');

router.use(authorizationRouter);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', (req, res, next) => {
  res.clearCookie('jwt');
  res.send({
   message: logOut});
  next();
});

module.exports = router;
