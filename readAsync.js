const fs = require('fs');

async function readAsync(path) {
  const buffer = await new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        console.error(error.message);
        return reject(error);
      }

      return resolve(data);
    });
  });

  return JSON.parse(buffer.toString());
}

module.exports.readAsync = readAsync;
