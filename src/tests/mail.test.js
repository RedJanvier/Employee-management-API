import { sendEmail } from '../utils';
import {
  sendCommunication,
  sendConfirmation,
  sendMail,
  sendReset
} from '../utils/mail';

describe('Email Tests: ', () => {
  const fakeTo = 'jdoe@fake.mail';
  it('It should send email with type and to: ', async (done) => {
    const fakeType = 'fakeType';
    const send = await sendEmail(fakeType, fakeTo);
    expect(send).toBe(undefined);
    done();
  });
  it('It should send email for communication: ', (done) => {
    const fakeType = 'communication';
    const send = sendCommunication(fakeType, fakeTo);
    expect(send).toBe(undefined);
    done();
  });
  it('It should send email for confirmation: ', (done) => {
    const fakeType = 'confirmation';
    const send = sendConfirmation(fakeType, fakeTo);
    expect(send).toBe(undefined);
    done();
  });
  it('It should send email for password reset: ', (done) => {
    const fakeType = 'password reset';
    const send = sendReset(fakeType, fakeTo);
    expect(send).toBe(undefined);
    done();
  });
  it('It should send email and return a preview: ', async (done) => {
    const fakeMail = {
      from: 'fakeFrom@mail.fake',
      to: fakeTo,
      subject: 'fake subject',
      html: `<p>fake body</p>`
    };
    const send = sendMail(fakeMail);
    console.log(send);
    expect(send).toBe(undefined);
    done();
  });
});
