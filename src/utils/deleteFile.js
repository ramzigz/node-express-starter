import fs from 'fs';

const deleteFile = (filePath) => {
  console.log('filePath', filePath);

  fs.unlink(filePath, (err) => {
    if (err) console.log('File not deleted!', err);
    console.log('File deleted!');
  });
};
export default deleteFile;
