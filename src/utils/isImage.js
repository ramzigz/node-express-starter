const imageFilter = (req, file, next) => {
  const allowedMimeTypes = ['image/png', 'image/jpeg'];

  // if (!allowedMimeTypes.includes(file.mimetype)) {
  //   return next(new ErrorHandler(httpStatusCodes.BAD_REQUEST, 'Only image files are allowed!'));
  // }
  return next(null, true);
};
export default imageFilter;
