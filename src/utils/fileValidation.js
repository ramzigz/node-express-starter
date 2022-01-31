const limits = {
  files: 15, // files per request
  fileSize: 1024 * 1024 * process.env.FILE_SIZE_LIMIT, //  (max file size)
};
export default limits;
