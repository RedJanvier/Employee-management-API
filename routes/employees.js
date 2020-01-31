const router = require('express').Router();
const employees = require('../controllers/employees');

router
    .route('/')
    .post(employees.create);

router
    .route('/:uuid')
    .delete(employees.delete);

router
    .route('/:uuid/:status')
    .put(employees.status);

module.exports = router;