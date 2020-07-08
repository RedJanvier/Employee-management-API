/* eslint-disable no-undef */
import { config as dotConfig } from 'dotenv';
// import { v4 as uuid } from 'uuid';
import request from 'supertest';
import { app, server } from '../app';
// import { signToken } from '../utils';

dotConfig();
const loginUrl = '/api/v1/managers/login';
// const createUrl = '/api/v1/managers/signup';

// const { JWT_LOGIN_SECRET } = process.env;

// const invalidLoginToken = signToken(
//   { name: 'John Doe', uuid: uuid(), status: 'active', email: 'john@doe.mail' },
//   JWT_LOGIN_SECRET,
//   '1ms'
// );

describe('manager endpoints', () => {
  //   let token;
  //   let managerId;
  const loginManager = { email: 'xce25704@bcaoo.com', password: 'Jannyda1' };
  //   const fakeManager = {
  //     name: 'manager',
  //     email: 'iss77624@eoopy.com',
  //     phone: 250727601322,
  //     nid: 1199880031234541,
  //     status: 'active',
  //     birthday: '1995-04-02',
  //     password: 'Jannyda1',
  //   };

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/v1/employees', () => {
    it('Manager should login', (done) => {
      request(app)
        .post(loginUrl)
        .send(loginManager)
        .end((err, res) => {
          if (err) throw err;
          //   token = res.body.token;
          expect.assertions(2);
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          done();
        });
    });
    // it('It should create a manager', (done) => {
    //   request(app)
    //     .post(createUrl)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(fakeManager)
    //     .end((err, res) => {
    //       if (err) throw err;
    //       managerId = res.body.data.uuid;
    //       expect.assertions(4);
    //       expect(res.body.success).toBe(true);
    //       expect(res.status).toBe(201);
    //       expect(res.body.message).toBe(
    //         `Please check your inbox to confirm your email!`
    //       );
    //       expect(res.body.data).toHaveProperty('uuid');
    //       done();
    //     });
    // });
    // it('It should delete a manager', (done) => {
    //   request(app)
    //     .delete(createUrl)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(fakeManager)
    //     .end((err, res) => {
    //       if (err) throw err;
    //       managerId = res.body.data.uuid;
    //       expect.assertions(4);
    //       expect(res.body.success).toBe(true);
    //       expect(res.status).toBe(201);
    //       expect(res.body.message).toBe(
    //         `Please check your inbox to confirm your email!`
    //       );
    //       expect(res.body.data).toHaveProperty('uuid');
    //       done();
    //     });
    // });
  });
});
