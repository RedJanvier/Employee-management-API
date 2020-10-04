import { expect } from 'chai';
import request from 'supertest';
import { describe, it, beforeEach, afterEach, after } from 'mocha';
import Employee from '../models/employees';
import { app, server } from '../app';
import { signToken } from '../utils';

const { JWT_LOGIN_SECRET } = process.env;
describe.skip('employee tests: ', () => {
  after(() => {
    server.close();
  });
  beforeEach(async () => {
    await Employee.destroy({ truncate: true });
  });
  afterEach(async () => {
    await Employee.destroy({ truncate: true });
  });
  const mockToken = `Bearer ${signToken({}, JWT_LOGIN_SECRET)}`;
  const mockEmployee = {
    name: 'test name',
    email: 'test@email.com',
    phone: 250788477237,
    position: 'developer',
    nid: 1199880037471326,
    status: 'active',
    birthday: '1996-01-02',
    password: 'Jannyda1',
  };
  it('should search for employees', async () => {
    await Employee.bulkCreate([
      mockEmployee,
      {
        ...mockEmployee,
        nid: 1199880037471322,
        phone: 250788477232,
        email: 'test2@email.com',
      },
      {
        ...mockEmployee,
        nid: 1199880037471323,
        phone: 250788477233,
        email: 'test3@email.com',
      },
      {
        ...mockEmployee,
        nid: 1199880037471324,
        phone: 250788477234,
        email: 'test1@email.com',
      },
    ]);
    const res = await request(app)
      .put(`/api/v1/employees/search?email=test&page=1&pageSize=10`)
      .set('authorization', mockToken);

    expect(res).to.have.property('status', 200);
    expect(res.body).to.have.property('found', 4);
    expect(res.body).to.have.property('success', true);
  });
  it('should delete an employee', async () => {
    const employee = await Employee.create(mockEmployee);
    const res = await request(app)
      .delete(`/api/v1/employees/${employee.uuid}`)
      .set('authorization', mockToken);

    expect(res).to.have.property('status', 200);
    expect(res.body).to.have.property('success', true);
  });
  it('should create an employee', async () => {
    const res = await request(app)
      .post(`/api/v1/employees`)
      .set('authorization', mockToken)
      .send(mockEmployee);

    expect(res).to.have.property('status', 201);
    expect(res.body).to.have.property('data');
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property(
      'message',
      `Employee ${mockEmployee.name} successfully created`
    );
  });
  it('should update an employee', async () => {
    const employee = await Employee.create(mockEmployee);
    const res = await request(app)
      .put(`/api/v1/employees/${employee.uuid}`)
      .set('authorization', mockToken)
      .send({ name: 'random' });

    expect(res).to.have.property('status', 200);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property(
      'message',
      `Employee successfully modified`
    );
  });
  it('should suspend and activate an employee', async () => {
    const employee = await Employee.create(mockEmployee);
    let status = 'suspend';
    let res = await request(app)
      .put(`/api/v1/employees/${employee.uuid}/${status}`)
      .set('authorization', mockToken);

    expect(res).to.have.property('status', 201);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property(
      'message',
      `Employee was ${status}ed successfully`
    );
    status = 'activate';
    res = await request(app)
      .put(`/api/v1/employees/${employee.uuid}/${status}`)
      .set('authorization', mockToken);

    expect(res).to.have.property('status', 201);
    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property(
      'message',
      `Employee was ${status}d successfully`
    );
  });
});
