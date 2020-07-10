/* eslint-disable no-undef */
import { uploadXL } from '../utils';

const fakeReq = {
  files: {
    employees: {
      mv: (path, cb) => {
        return cb(null);
      },
    },
  },
};
describe('Excel Tests: ', () => {
  it('It should upload an excel sheet: ', async (done) => {
    const fakeErrorRes = uploadXL(fakeReq);
    expect.assertions(1);
    expect(fakeErrorRes).toBe(true);
    done();
  });
});
