const router = require('express').Router();
const managers = require('../controllers/managers');

router.route('/login').post(managers.login);
router.route('/signup').post(managers.create);
router.route('/reset').post(managers.requestReset);

router.route('/confirm/:confirmationToken').get(managers.confirm);
router
    .route('/reset/:token')
    .get((req, res) => res.sendStatus(400))
    .post(managers.confirmReset);

module.exports = router;
