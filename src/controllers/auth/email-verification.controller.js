/* eslint-disable no-underscore-dangle */
import sendMail from '../../utils/sendEmail';
import verifyEmailTemplate from '../../utils/verifyEmailTemplate';

export async function sendVerificationEmail({
  req, res, next, usersService, ErrorHandler, responseHandler,
  httpStatusCodes, generateCode, randomBytesAsync,
}) {
  try {
    let userEmail = req.user.email || req.body.email;

    const setRandomToken = async () => {
      const code = generateCode(5);
      const token = await randomBytesAsync(32);
      let user = await usersService.getOne({ email: userEmail });
      if (!user) {
        return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'Account with that email address does not exist.'));
      }

      user.emailVerificationCode = code;
      user.emailVerificationToken = token.toString('hex');
      user = user.save();
      return user;
    };

    const sendEmail = (user) => {
      const token = user.emailVerificationToken;
      const code = user.emailVerificationCode;
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL || 'genextit.dev@gmail.com',
        subject: `Vérifier votre addresse mail sur ${process.env.APP_NAME}`,
        html: verifyEmailTemplate(token, code), // html body
      };
      const mailSettings = {
        successfulType: 'info',
        successfulMsg: `Un e-mail a été envoyé à ${user.email} avec d'autres instructions.`,
        loggingError: "ERREUR : impossible d'envoyer un e-mail après la mise à niveau de la sécurité.\n",
        errorType: 'errors',
        errorMsg: 'Error sending the password reset message. Please try again shortly.',
        mailOptions,
        req,
      };
      userEmail = user.email;
      return sendMail(mailSettings);
    };

    return setRandomToken()
      .then(sendEmail)
      .then(() => res.status(httpStatusCodes.OK).json(responseHandler({ message: `An email containing a verification code was sent successfully to ${userEmail}`, msgCode: httpStatusCodes.FORGOT_PASSWORD_EMAIL })))
      .catch((err) => next(new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, { msg: 'An error occured while sending the email', err })));
  } catch (error) {
    return next(new ErrorHandler(httpStatusCodes.INTERNAL_SERVER));
  }
}

export async function verifyEmail({
  req, res, next, usersService, ErrorHandler,
  responseHandler, httpStatusCodes, generateCode,
  randomBytesAsync,
}) {
  try {
    const { token, code } = req.body;
    if ((!code && !token) || (code && code.length < 5)) {
      return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'Token is invalid or has expired.'));
    }

    const filter = {
      ...(token && { emailVerificationToken: token }),
      ...(code && { emailVerificationCode: code }),
    };

    const user = await usersService.getOne(filter);

    if (!user) {
      return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'Token is invalid or has expired.'));
    }

    const newCode = generateCode(5);
    const newToken = await randomBytesAsync(32);
    user.emailVerificationCode = newCode;
    user.emailVerificationToken = newToken.toString('hex');

    user.emailVerified = true;
    await user.save();

    return res.status(httpStatusCodes.OK).json(
      responseHandler({ message: 'Email is verified successfully' }),
    );
  } catch (error) {
    console.log('error verifyEmail', error);

    return next(new ErrorHandler(httpStatusCodes.INTERNAL_SERVER));
  }
}
