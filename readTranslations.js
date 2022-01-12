const core = require('@actions/core');
const path = require('path');

async function readTranslations(translationsPath) {
  const relativePath = translationsPath || './index';
  const absolutePath = path.join(__dirname, relativePath);
  const translations = {};
  const loadedTranslations = require(absolutePath);
  core.info(`Absolute path: ${absolutePath}`);

  Object.keys(loadedTranslations).forEach((key) => {
    translations[key] = loadedTranslations[key];
  });

  return JSON.stringify(translations);
}

module.exports.readTranslations = readTranslations;
