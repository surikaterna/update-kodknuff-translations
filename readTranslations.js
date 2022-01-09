async function readTranslations(translationsPath) {
  const path = translationsPath || './index';
  const translations = {};
  const loadedTranslations = require(path);

  Object.keys(loadedTranslations).forEach((key) => {
    translations[key] = loadedTranslations[key];
  });

  return JSON.stringify(translations);
}

module.exports.readTranslations = readTranslations;
