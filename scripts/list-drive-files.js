#!/usr/bin/env node

const { authorize, listDriveFiles } = require('../src/simple-mind');

(async () => {
  const simpleMindAuth = await authorize();
  const files = await listDriveFiles(simpleMindAuth);
  console.log(files);
})();
