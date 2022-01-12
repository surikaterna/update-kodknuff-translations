const core = require('@actions/core');
const { exec } = require('child_process');
const { readTranslations } = require('./readTranslations');
const { readVersion } = require('./readVersion');
const { publishTranslations } = require('./publishTranslations');

async function run() {
  try {
    const os = core.getInput('os');
    const translationsPath = core.getInput('translationsPath') || './testData';
    core.info(`Run on OS ${os}`);

    if (os) {
      exec(os === 'win' ? 'dir' : 'ls -la', (error, stdout, stderr) => {
        if (error) {
          core.error(error);
          return;
        }

        core.info(`stdout: ${stdout}`);
        core.error(`stderr: ${stderr}`);
      });

      if (os === 'unix') {
        exec(`cat ${translationsPath}`, (error, stdout, stderr) => {
          if (error) {
            core.error(error);
            return;
          }

          core.info(`stdout: ${stdout}`);
          core.error(`stderr: ${stderr}`);
        });
      }
    }

    const packagePath = core.getInput('packagePath') || './package.json';
    core.info(`Reading version from ${packagePath}`);
    const version = await readVersion(packagePath);
    core.info(`Version is ${version}`);

    core.info(`Reading translations from ${translationsPath}`);
    const translations = await readTranslations(translationsPath);

    core.info('Translations read. Will publish.');
    const artifact = core.getInput('artifact') || 'test-translations';
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
