const { getPath } = require('../utils');

module.exports = {
  TOKEN_PATH: getPath('evernote-token.json'),
  REDIRECT_URL: 'https://pahund.github.io/whats-going-on',
  MAX_TODOS: 500,
  REQUEST_BATCH_SIZE: 10,
  REQUEST_BATCH_INTERVAL: 500
};
