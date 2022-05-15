import sendMail from '../../../utils/sendEmail.js';

export function forgotPassword({
  req, res, next, crudHandler,
  ErrorHandler, responseHandler,
  httpStatusCodes, generateCode,
}) {
  try {
    let userEmail = '';

    const setRandomToken = async () => {
      const code = generateCode(5);
      let user = await crudHandler.getOne({ model: 'User', filters: { email: req.body.email } });
      if (!user) {
        return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'Account with that email address does not exist.'));
      }
      user.passwordResetToken = code;
      user.passwordResetExpires = Date.now() + 3600000; // 1 hour
      user = user.save();

      return user;
    };

    const sendForgotPasswordEmail = (user) => {
      const token = user.passwordResetToken;

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL || 'genextit.dev@gmail.com',
        subject: `Réinitialisez votre mot de passe sur ${process.env.APP_NAME}`,
        html: `Vous recevez cet e-mail car vous (ou quelqu'un d'autre) avez demandé la
         réinitialisation du mot de passe de votre compte.\n\n
        <h1><strong>    ${token}\n\n</strong></h1>
        Si vous ne l'avez pas demandé, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.\n`,
      };

      const mailSettings = {
        successfulType: 'info',
        successfulMsg: `Un e-mail a été envoyé à ${user.email} avec d'autres instructions.`,
        loggingError: `ERREUR: impossible d'envoyer un e-mail de mot 
        de passe oublié après la mise à niveau de la sécurité.\n`,
        errorType: 'errors',
        errorMsg: 'Error sending the password reset message. Please try again shortly.',
        mailOptions,
        req,
      };

      userEmail = user.email;
      return sendMail(mailSettings);
    };

    return setRandomToken()
      .then(sendForgotPasswordEmail)
      .then(() => res.status(httpStatusCodes.OK)
        .json(responseHandler({
          message: `An email containing a reset code was sent successfully to ${userEmail}`,
          msgCode: httpStatusCodes.FORGOT_PASSWORD_EMAIL,
        })))
      .catch((err) => next(new ErrorHandler(
        httpStatusCodes.INTERNAL_SERVER,
        {
          msg: 'An error occured while sending the email',
          err,
        }
      )));
  } catch (error) {
    return next(new ErrorHandler(httpStatusCodes.INTERNAL_SERVER));
  }
}

export async function verifyCode({
  req, res, next, crudHandler, ErrorHandler, responseHandler, httpStatusCodes,
}) {
  try {
    const user = await crudHandler.getOne({ model: 'User',
      filters: {
        passwordResetToken: req.body.code,
        passwordResetExpires: { $gt: new Date().toISOString() },
      } });

    if (!user) {
      return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'Password reset token is invalid or has expired.'));
    }

    return res.status(httpStatusCodes.OK).json(
      responseHandler({ message: 'Code is verified successfully' }),
    );
  } catch (error) {
    return next(new ErrorHandler(httpStatusCodes.INTERNAL_SERVER));
  }
}

export async function resetPassword({
  req, res, next, crudHandler, ErrorHandler, responseHandler, httpStatusCodes, randomBytesAsync,
}) {
  try {
    const setPassword = async () => {
      const user = await crudHandler.getOne({ model: 'User',
        filters: {
          passwordResetToken: req.body.code,
          passwordResetExpires: { $gt: new Date().toISOString() },
        } });

      if (!user) {
        return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'Password reset token is invalid or has expired.'));
      }

      const newToken = await randomBytesAsync(32);

      user.password = req.body.password;
      user.passwordResetToken = newToken.toString('hex');
      user.passwordResetExpires = undefined;
      user.save();

      return user;
    };

    const sendResetPasswordEmail = (user) => {
      if (!user) {
        return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'Password reset token is invalid or has expired.'));
      }

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL || 'genextit.dev@gmail.com',
        subject: `Votre mot de passe sur ${process.env.APP_NAME} a été changé`,
        text: `Bonjour,\n\nCeci est une confirmation que le mot de passe
         de votre compte ${user.email} vient d'être changé.\n`,
      };

      const mailSettings = {
        successfulType: 'success',
        successfulMsg: 'Succès! Votre mot de passe a été changé.',
        loggingError: `ERREUR: impossible d'envoyer l'e-mail de confirmation
         de réinitialisation du mot de passe après la mise à niveau de la sécurité.\n`,
        errorType: 'warning',
        errorMsg: `Your password has been changed, however we were unable 
        o send you a confirmation email. We will be looking into it shortly.`,
        mailOptions,
        req,
      };
      return sendMail(mailSettings);
    };

    return setPassword()
      .then(sendResetPasswordEmail)
      .then(() => res.status(httpStatusCodes.OK).json(
        responseHandler({ message: 'Password updated successfully' }),
      ))
      .catch((err) => next(new ErrorHandler(httpStatusCodes.INTERNAL_SERVER, {
        msg: 'An error occured while sending the email',
        err,
      })));
  } catch (error) {
    return next(new ErrorHandler(httpStatusCodes.INTERNAL_SERVER));
  }
}
