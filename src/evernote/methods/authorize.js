const { readFileSync } = require('fs');
const { TOKEN_PATH } = require('../constants');
const { rejectWithCustomMessage, WhatsGoingOnError } = require('../../utils');
const { Client } = require('evernote');
const { getAccessToken } = require('../utils');

module.exports = () =>
  new Promise((resolve, reject) => {
    const consumerKey = process.env.EVERNOTE_API_CONSUMER_KEY;
    const consumerSecret = process.env.EVERNOTE_API_CONSUMER_SECRET;
    const sandbox = process.env.EVERNOTE_API_SANDBOX === 'true';
    const china = process.env.EVERNOTE_API_CHINA === 'true';
    if (!consumerKey || !consumerSecret) {
      reject(
        new WhatsGoingOnError(
          'Error – no Evernote API consumer key / secret configured, do you have your .env file set up properly?'
        )
      );
      return;
    }
    let rawToken;
    try {
      rawToken = readFileSync(TOKEN_PATH);
    } catch (err) {
      // no rejection because it's OK if there is no token on the local
      // file system – we'll have the user generate one in this case
      const client = new Client({
        consumerKey,
        consumerSecret,
        sandbox,
        china
      });
      getAccessToken(client)
        .then(authorizedClient => resolve(authorizedClient))
        .catch(err => reject(err));
      return;
    }
    let token;
    try {
      ({ token } = JSON.parse(rawToken));
    } catch (err) {
      return rejectWithCustomMessage(`Error parsing token from token file ${TOKEN_PATH}`, reject, err);
    }
    resolve(
      new Client({
        token,
        sandbox,
        china
      })
    );
  });
