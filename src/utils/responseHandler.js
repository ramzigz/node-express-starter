export default ({
  success, data, message, msgCode, statusCode,
}) => ({
  success: success || true,
  data: data || null,
  message: message || null,
  msgCode: msgCode || null,
  statusCode: statusCode || null,
});
