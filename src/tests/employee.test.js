/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { config as dotConfig } from 'dotenv';
import { v4 as uuid } from 'uuid';
import request from 'supertest';
import { app, server } from '../app';
import { signToken } from '../utils';

dotConfig();
const createUrl = '/api/v1/employees';

const { JWT_LOGIN_SECRET } = process.env;

const validLoginToken = signToken(
  { name: 'John Doe', uuid: uuid(), status: 'active', email: 'john@doe.mail' },
  JWT_LOGIN_SECRET,
  '600s'
);
const invalidLoginToken = signToken(
  { name: 'John Doe', uuid: uuid(), status: 'active', email: 'john@doe.mail' },
  JWT_LOGIN_SECRET,
  '1ms'
);

describe('employee endpoints', () => {
  // let token;
  let employeeId;
  const fakeEmployee = {
    name: 'new comer',
    email: 'exw05842@zzrgg.com',
    phone: 250788477527,
    position: 'developer',
    nid: 1199880037471216,
    status: 'active',
    birthday: '1996-01-02',
    password: '123MyLittleSecret',
  };

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/v1/employees', () => {
    it('It should create an employee', (done) => {
      request(app)
        .post(createUrl)
        .set('Authorization', `Bearer ${validLoginToken}`)
        .send(fakeEmployee)
        .end((err, res) => {
          if (err) throw err;
          employeeId = res.body.data.uuid;
          expect.assertions(4);
          expect(res.body.success).toBe(true);
          expect(res.status).toBe(201);
          expect(res.body.message).toBe(
            `Employee ${fakeEmployee.name} successfully created`
          );
          expect(res.body.data).toHaveProperty('uuid');
          done();
        });
    });
    it('It should fail to create an employee on invalidToken', (done) => {
      request(app)
        .post(createUrl)
        .set('Authorization', `Bearer ${invalidLoginToken}`)
        .send(fakeEmployee)
        .end((err, res) => {
          if (err) throw err;
          expect.assertions(3);
          expect(res.body.success).toBe(false);
          expect(res.status).toBe(401);
          expect(res.body.error).toBe('please signup/login first!');
          done();
        });
    });
    it('It should fail to create an employee on noToken', (done) => {
      request(app)
        .post(createUrl)
        .send(fakeEmployee)
        .end((err, res) => {
          if (err) throw err;
          expect.assertions(3);
          expect(res.body.success).toBe(false);
          expect(res.status).toBe(401);
          expect(res.body.error).toBe('make sure you provide a login token');
          done();
        });
    });
    it('It should delete an employee', (done) => {
      request(app)
        .delete(`${createUrl}/${employeeId}`)
        .set('Authorization', `Bearer ${validLoginToken}`)
        .end((err, res) => {
          if (err) throw err;
          expect.assertions(3);
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('1 Employees successfully deleted');
          done();
        });
    });
  });
});
