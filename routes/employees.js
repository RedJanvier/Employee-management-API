const router = require('express').Router();
const employees = require('../controllers/employees');

router
    .route('/')
    .post(employees.create);

module.exports = router;