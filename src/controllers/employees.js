import { QueryTypes, Op } from 'sequelize';

import {
  sendEmail,
  managerLog,
  uploadXL,
  readXL,
  ErrorResponse,
} from '../utils';
import { conn as db } from '../config/database';
import { asyncHandler } from '../middlewares';
import Employee from '../models/employees';

// @desc    Create an employee
// Route    POST /api/v1/employees
// Access   Private
export const create = asyncHandler(async (req, res) => {
  const employee = await Employee.create(req.body);
  await sendEmail('communication', employee.email);
  managerLog('create', {
    manager: req.decoded.name,
    employee: employee.name,
  });
  res.status(201).json({
    success: true,
    message: `Employee ${employee.name} successfully created`,
  });
});

// @desc    Create many employees from excelsheet
// Route    POST /api/v1/employees/many
// Access   Private
export const createMany = asyncHandler(async (req, res) => {
  await uploadXL(req);
  setTimeout(() => {
    const employeesList = readXL();
    employeesList.map(
      asyncHandler(async (data) => {
        const employee = await Employee.create(data);
        await sendEmail('communication', employee.email);
        managerLog('create', {
          manager: req.decoded.name,
          employee: employee.name,
        });
        return employee;
      })
    );
    res.status(200).json('Successfully stored employees list');
  }, 100);
});

// @desc    Delete an employee
// Route    DELETE /api/v1/employees/:uuid
// Access   Private
export const deleteEmployee = asyncHandler(async (req, res) => {
  const { uuid } = req.params;
  const employee = await Employee.destroy({ where: { uuid } });
  if (!employee) throw new ErrorResponse('Employee not found', 400);

  managerLog('delete', {
    manager: req.decoded.name,
    employee: uuid,
  });

  res.status(200).json({
    success: true,
    message: `${employee} Employees successfully deleted`,
  });
});

// @desc    Edit an employee
// Route    PUT /api/v1/employees/:id
// Access   Private
export const edit = asyncHandler(async (req, res) => {
  const { uuid } = req.params;

  const [employee] = await Employee.update(
    { ...req.body, updatedAt: new Date() },
    { where: { uuid } }
  );

  if (!employee) throw new ErrorResponse('Employee not modified', 400);
  managerLog('edit', {
    manager: req.decoded.name,
    employee: uuid,
  });
  res.status(200).json({
    success: true,
    message: `Employee successfully modified`,
  });
});

// @desc    Suspend/Activate an employee
// Route    PUT /api/v1/employees/:id/:status
// Access   Private
export const changeStatus = asyncHandler(async (req, res) => {
  const { uuid } = req.params;
  let { status } = req.params;
  if (status === 'activate' || status === 'suspend') {
    await db.query(
      `UPDATE employees SET status = :status, "updatedAt" = :updatedAt WHERE employees.uuid = :uuid`,
      {
        replacements: {
          status: status === 'activate' ? 'active' : 'inactive',
          uuid,
          updatedAt: new Date(),
        },
        type: QueryTypes.UPDATE,
      }
    );
    status = status === 'suspend' ? 'suspende' : '';

    managerLog('status', {
      manager: req.decoded.name,
      status,
      employee: uuid,
    });

    res.status(201).json({
      success: true,
      message: `Employee was ${status}d successfully`,
    });
  } else {
    throw new ErrorResponse('Route does not exist', 404);
  }
});

// @desc    Search for employees
// Route    PUT /api/v1/employees/search
// Access   Private
export const search = asyncHandler(async (req, res) => {
  const { page, pageSize } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const where = {};
  const query = {
    ...req.query,
    page: undefined,
    pageSize: undefined,
  };
  Object.keys(query).map((q) => {
    where[q] = {
      [Op.iLike]: `%${req.query[q]}%`,
    };
    return true;
  });

  const employees = await Employee.findAll({ offset, limit, where });
  const all = await Employee.findAll({ where });
  managerLog('search', {
    manager: req.decoded.name,
  });
  res.status(200).json({
    success: true,
    found: all.length,
    data: employees.map(({ dataValues }) => ({
      ...dataValues,
      password: null,
    })),
  });
});
