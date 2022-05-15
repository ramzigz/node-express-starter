class ErrorHandler extends Error {
  constructor(statusCode, message, errorCode, name) {
    super();
    this.statusCode = statusCode;
    this.errorCode = errorCode || statusCode;
    this.message = message;
    this.name = name;
  }
}
const handleError = ({ err, res }) => {
  const {
    statusCode, errorCode, message, details, name,
  } = err;
  res.status(statusCode).json({
    success: false,
    error: {
      name,
      code: Number(errorCode) || statusCode,
      message: `${message}, ${details && details.body ? details?.body[0]?.message.replace(/"/g, '') : ''}`,
      details,
    },

  });
};

export {
  ErrorHandler,
  handleError,
};
