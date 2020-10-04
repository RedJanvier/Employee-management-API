import { ErrorResponse } from '../utils';

describe('Error Response Tests: ', () => {
  it('It should add a message and a statusCode to the Error object: ', async (done) => {
    const fakeErrorCode = 400;
    const fakeErrorMsg = 'fake message';
    const fakeError = new ErrorResponse(fakeErrorMsg, fakeErrorCode);
    expect.assertions(4);
    expect(fakeError).toHaveProperty('message');
    expect(fakeError).toHaveProperty('statusCode');
    expect(fakeError.message).toBe(fakeErrorMsg);
    expect(fakeError.statusCode).toBe(fakeErrorCode);
    done();
  });
});
