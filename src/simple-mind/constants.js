const { getPath } = require('../utils');

module.exports = {
  TOKEN_PATH: getPath('google-drive-token.json'),
  CREDENTIALS_PATH: getPath('google-drive-credentials.json'),
  SMMX_PATH: getPath('whats-going-on.smmx'),
  // If modifying these scopes, delete google-drive-token.json.
  // SCOPES: ['https://www.googleapis.com/auth/drive.readonly'],
  SCOPES: ['https://www.googleapis.com/auth/drive'],
  // ID of the file “whats-going-on.smmx” on Google Drive
  FILE_ID: '1nuYwOYGNcBQ0NA06hyafUcAvkvhk7bOv',
  SPACING_X: 300,
  SPACING_Y: 75
};
