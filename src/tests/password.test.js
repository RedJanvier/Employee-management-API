/* eslint-disable no-undef */
import { encryptPassword, decryptPassword } from '../utils';

describe('Password Tests: ', () => {
  it('It should encrypt and decrypt password: ', async (done) => {
    const fakePass = 'fakePassword';
    const fakePassEncrypted = await encryptPassword(fakePass);
    expect.assertions(1);
    expect(await decryptPassword(fakePass, fakePassEncrypted)).toBe(true);
    done();
  });
});
