import { expect } from 'chai';
import { describe, it } from 'mocha';
import { encryptPassword, decryptPassword } from '../utils';

describe('Password Tests: ', () => {
  it('It should encrypt and decrypt password: ', async () => {
    const fakePass = 'fakePassword';
    const fakePassEncrypted = await encryptPassword(fakePass);
    const isValid = await decryptPassword(fakePass, fakePassEncrypted);
    expect(isValid).to.be.equal(true);
  });
});
