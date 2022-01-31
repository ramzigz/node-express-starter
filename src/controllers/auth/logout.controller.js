/* eslint-disable no-underscore-dangle */
export default async function logout({
  req, res, httpStatusCodes, responseHandler, usersService,
}) {
  const user = await usersService.getById(req.user._id, '', '');

  for (let index = 0; index < user.tokens.length; index += 1) {
    const tokenItem = user.tokens[index];

    if (tokenItem.session === req.sessionID) {
      user.tokens.splice(index, 1);
    }
  }
  user.save();

  // await usersService.update(req.user._id, { token: '' });
  return res.status(httpStatusCodes.OK).json(
    responseHandler({ message: 'User disconnected' }),
  );
}
