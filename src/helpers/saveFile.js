import fs from 'fs';
import https from 'https';

export default function saveFile(url, localPath, cb) {
  const file = fs.createWriteStream(localPath);
  const request = https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb); // close() is async, call cb after close completes.
    });
  }).on('error', (err) => { // Handle errors
    fs.unlink(localPath); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
}
