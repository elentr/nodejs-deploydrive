import transporter from './mailer.js';

export async function sendVerificationEmail(email) {
  return transporter.sendMail({
    to: email,
    subject: 'Підтвердження електронної пошти',
    text: 'Перейдіть за посиланням, щоб підтвердити вашу пошту.',
  });
}
