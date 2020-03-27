const router = require('express').Router();
const managers = require('../controllers/managers');
const middlewares = require('../middlewares/employees');

router.route('/login').post(managers.login);
router.route('/signup').post(middlewares.checkAuth, managers.create);
router.route('/reset').post(managers.requestReset);

router.route('/confirm/:confirmationToken').get(managers.confirm);
router
    .route('/reset/:token')
    .get((_, res) => res.sendStatus(400))
    .post(middlewares.checkAuth, managers.confirmReset);

module.exports = router;
