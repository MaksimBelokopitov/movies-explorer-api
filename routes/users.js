const router = require('express').Router();
const { updateUser, getActiveUser } = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/userValidation');

router.get('/me', getActiveUser);
router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
