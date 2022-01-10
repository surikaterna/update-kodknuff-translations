require('cross-fetch/polyfill');
const core = require('@actions/core');

async function publishTranslations(translations, version, artifact) {
  const url = process.env.KODKNUFF_URL;
  const token = process.env.KODKNUFF_TOKEN;

  if (!url) {
    core.notice('Secret: KODKNUFF_URL is missing.');
  }

  if (!token) {
    core.notice('Secret: KODKNUFF_TOKEN is missing.');
  }

  if (!artifact) {
    core.notice('Input: artifact is missing.');
  }

  if (!url || !token || !artifact) {
    return;
  }

  core.debug(`Translation keys: ${Object.keys(JSON.parse(translations))}`);

  return await fetch(`${url}/kod/${artifact}/${version}`, {
    method: 'PUT',
    body: translations,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

module.exports.publishTranslations = publishTranslations;
