const core = require('@actions/core');
const { readTranslations } = require('./readTranslations');
const { readVersion } = require('./readVersion');
const { publishTranslations } = require('./publishTranslations');

async function run() {
  try {
    const packagePath = core.getInput('packagePath') || './package.json';
    core.info(`Reading version from ${packagePath}`);
    const version = await readVersion(packagePath);
    core.info(`Version is ${version}`);

    const translationsPath = core.getInput('translationsPath') || './index';
    core.info(`Reading translations from ${translationsPath}`);
    const translations = await readTranslations(translationsPath);

    core.info('Translations read. Will publish.');
    const artifact = core.getInput('artifact');
    const response = await publishTranslations(translations, version, artifact);

    if (response) {
      core.info(`Published version "${version}" successfully.`);
    } else {
      core.info(`Failed to publish version "${version}".`);
    }

    core.setOutput('version', version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
