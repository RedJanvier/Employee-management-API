const router = require('express').Router();
const managers = require('../controllers/managers');

router.route('/signup').post(managers.create);
router.route('/confirm/:confirmationToken').get(managers.confirm);

module.exports = router;
