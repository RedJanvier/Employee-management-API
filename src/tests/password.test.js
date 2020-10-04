import { encryptPassword, decryptPassword } from '../utils';

describe('Password Tests: ', () => {
  it.skip('It should encrypt and decrypt password: ', async () => {
    const fakePass = 'fakePassword';
    const fakePassEncrypted = await encryptPassword(fakePass);
    const isValid = await decryptPassword(fakePass, fakePassEncrypted);
    expect.assertions(1);
    expect(isValid).toBe(true);
  });
});
