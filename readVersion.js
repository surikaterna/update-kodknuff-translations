const core = require('@actions/core');
const { readAsync } = require('./readAsync');

async function readVersion(packagePath) {
  const packageJson = await readAsync(packagePath);
  core.info('Read package:');
  core.info(JSON.stringify(packageJson, null, 2));
  return packageJson.version;
}

module.exports.readVersion = readVersion;
