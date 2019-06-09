const { readFileSync } = require("fs");
const { CREDENTIALS_PATH } = require("./constants");
const { rejectWithCustomMessage } = require("../utils");
const { Client } = require("evernote");
const getAccessToken = require('./getAccessToken');

module.exports = () =>
  new Promise((resolve, reject) => {
    let rawCredentials;
    try {
      rawCredentials = readFileSync(CREDENTIALS_PATH);
    } catch (err) {
      return rejectWithCustomMessage(
        `Error loading client secret file ${CREDENTIALS_PATH}`,
        reject,
        err
      );
    }
    let credentials;
    try {
      credentials = JSON.parse(rawCredentials);
    } catch (err) {
      return rejectWithCustomMessage(
        `Error parsing credentials from client secret file ${CREDENTIALS_PATH}`,
        reject,
        err
      );
    }
    const client = new Client(credentials);
    getAccessToken(client).then(authorizedClient => {
      resolve(authorizedClient);
    }).catch(err => reject(err));
  });
