const process = require('process');
const cp = require('child_process');
const path = require('path');
const { readVersion } = require('./readVersion');
const { readTranslations } = require('./readTranslations');

test('reads package version', async () => {
  const version = await readVersion('./package.json');
  expect(version).toBe('1.0.0');
});

test('reads language data', async () => {
  const translations = await readTranslations('./testData');
  const parsedTranslations = JSON.parse(translations);
  expect(parsedTranslations.se.hi).toBe('hej');
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  const ip = path.join(__dirname, 'index.js');
  console.log({ ip });
  const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
  console.log(result);
})
