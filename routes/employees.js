const router = require('express').Router();
const employees = require('../controllers/employees');

router
    .route('/')
    .post(employees.create);

router
    .route('/:uuid')
    .delete(employees.delete);

router
    .route('/:uuid/activate')
    .put(employees.activate);

module.exports = router;