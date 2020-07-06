import { QueryTypes, Op } from 'sequelize';

import Employee from '../models/employees';
import * as utils from '../utils/employees';
import { conn as db } from '../config/database';

// @desc    Create an employee
// Route    POST /api/v1/employees
// Access   Private
export const create = (req, res) => {
  return db
    .sync({ logging: false })
    .then(async () => {
      const employee = await Employee.create(req.body);

      await utils.sendEmail('communication', employee.email);

      utils.managerLog('create', {
        manager: req.decoded.name,
        employee: employee.name,
      });

      return res.status(201).json({
        success: true,
        message: `Employee ${employee.name} successfully created`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Employee not created',
      });
    });
};

// @desc    Create many employees from excelsheet
// Route    POST /api/v1/employees/many
// Access   Private
export const createMany = async (req, res) => {
  try {
    await utils.uploadXL(req);
    setTimeout(() => {
      const employeesList = utils.readXL();

      employeesList.map(async (data) => {
        try {
          await db.sync({ logging: false });
          const employee = await Employee.create(data);

          utils.managerLog('create', {
            manager: req.decoded.name,
            employee: employee.name,
          });
          await utils.sendEmail('communication', employee.email);

          return employee;
        } catch (error) {
          console.log(error);
          return null;
        }
      });

      res.status(200).json('Successfully stored employees list');
    }, 100);
  } catch (error) {
    console.log(error);
    res.status(500).json('Unsuccessful! Unable to store employees list');
  }
};

// @desc    Delete an employee
// Route    DELETE /api/v1/employees/:uuid
// Access   Private
export const _delete = async (req, res) => {
  const { uuid } = req.params;
  try {
    const employee = await Employee.destroy({ where: { uuid } });

    if (employee === 0) {
      throw new Error('Employee not found');
    }

    utils.managerLog('delete', {
      manager: req.decoded.name,
      employee: uuid,
    });

    console.log(
      `===== MANAGER LOG: ${
        req.decoded.name
      } deleted ${uuid} at ${Date.now()} ======`
    );

    res.status(200).json({
      success: true,
      message: `${employee} Employees successfully deleted`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Edit an employee
// Route    PUT /api/v1/employees/:id
// Access   Private
export const edit = (req, res) => {
  const { uuid } = req.params;
  const { body } = req;

  db.sync({ logging: false })
    .then(async () => {
      try {
        const employee = await Employee.update(
          {
            ...body,
            updatedAt: new Date(),
          },
          {
            where: { uuid },
          }
        );

        if (!employee[0]) {
          throw new Error('Employee not created');
        }

        utils.managerLog('edit', {
          manager: req.decoded.name,
          employee: uuid,
        });

        await res.status(200).json({
          success: true,
          message: `Employee successfully modified`,
        });
      } catch (error) {
        await res.status(304).json({
          success: false,
          message: error.message,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Error occurred on the server; Employee not modified',
      });
    });
};

// @desc    Suspend/Activate an employee
// Route    PUT /api/v1/employees/:id/:status
// Access   Private
export const changeStatus = (req, res) => {
  const { uuid } = req.params;
  let { status } = req.params;
  if (status === 'activate' || status === 'suspend') {
    try {
      db.query(
        `UPDATE employees SET status = :status, "updatedAt" = :updatedAt WHERE employees.uuid = :uuid`,
        {
          replacements: {
            status: status === 'activate' ? 'active' : 'inactive',
            uuid,
            updatedAt: new Date(),
          },
          type: QueryTypes.UPDATE,
        }
      ).then(() => {
        status = status === 'suspend' ? 'suspende' : '';

        utils.managerLog('status', {
          manager: req.decoded.name,
          status,
          employee: uuid,
        });

        res.status(201).json({
          success: true,
          message: `Employee was ${status}d successfully`,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(304).json({
        success: false,
        message: 'Employee not activated',
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: 'Route does not exist',
    });
  }
};

// @desc    Search for employees
// Route    PUT /api/v1/employees/search
// Access   Private
export const search = async (req, res) => {
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const query = {
    ...req.query,
    page: undefined,
    pageSize: undefined,
  };

  const where = {};
  Object.keys(query).map(async (q) => {
    where[q] = {
      [Op.iLike]: `%${req.query[q]}%`,
    };
  });

  try {
    const employees = await Employee.findAll({ offset, limit, where });
    const all = await Employee.findAll({ where });

    utils.managerLog('search', {
      manager: req.decoded.name,
    });

    return res.status(200).json({
      success: true,
      found: all.length,
      data: employees.map((employee) => ({
        ...employee.dataValues,
        password: null,
      })),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
