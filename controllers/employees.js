// const Employees = require('')

exports.create = (req, res, next) => {
    const { name, email, phone, position, nid, status, birthday } = req.body;

    

    res.status(201).json({
        success: true,
        message: `Employee ${name} successfully created`
    });
};