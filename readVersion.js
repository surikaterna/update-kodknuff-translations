const { readAsync } = require('./readAsync');

async function readVersion(packagePath) {
  const packageJson = await readAsync(packagePath);
  return packageJson.version;
}

module.exports.readVersion = readVersion;
