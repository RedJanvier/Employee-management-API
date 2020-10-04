import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ErrorResponse } from '../utils';

describe('Error Response Tests: ', () => {
  it('It should add a message and a statusCode to the Error object: ', async () => {
    const fakeErrorCode = 400;
    const fakeErrorMsg = 'fake message';
    const fakeError = new ErrorResponse(fakeErrorMsg, fakeErrorCode);
    expect(fakeError).to.have.property('message');
    expect(fakeError).to.have.property('statusCode');
    expect(fakeError.message).to.be.equal(fakeErrorMsg);
    expect(fakeError.statusCode).to.be.equal(fakeErrorCode);
  });
});
