const title = (text) => `<h3>${text}</h3>`;

export default {
  FORGOT_PASSWORD: {
    code: 'FORGOT_PASSWORD',
    subject: 'Boilerplate - Reset your password',
    sms: 'Reset your password {{resetLink}}',
    html: `${title(
      'Reset your password',
    )}<p>Insert your custom body here.</p>
    <a href="{{resetLink}}" target="_blank" class="button"> Reset Password</a>`,
  },
  WELCOME_USER: {
    code: 'WELCOME_User',
    subject: 'Welcome to Boilerplate!',
    sms: '',
    html: `${title(
      'Hi {{firstName}},',
    )}<p>Insert your custom body here.</p>
    <a href="{{resetLink}}" target="_blank" class="button">Create Account</a>$`,
  },
  SMS_ENABLED: {
    code: 'SMS_ENABLED',
    subject: '',
    sms: 'Boilerplate: SMS Notifications enabled.',
    html: ``,
  },
  TWO_FACTOR_SMS: {
    code: 'TWO_FACTOR_SMS',
    subject: '',
    sms: '{{number}} is your verification code from Boilerplate.',
    html: ``,
  },
};
