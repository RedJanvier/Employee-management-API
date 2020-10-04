import { expect } from 'chai';
import { describe, it } from 'mocha';
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
  it('It should upload an excel sheet: ', async () => {
    const fakeErrorRes = uploadXL(fakeReq);
    expect(fakeErrorRes).to.be.equal(true);
  });
});
