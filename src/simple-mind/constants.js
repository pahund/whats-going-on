const { getPath } = require('../utils');

module.exports = {
  TOKEN_PATH: getPath('google-drive-token.json'),
  SMMX_PATH: getPath('whats-going-on.smmx'),
  // If modifying these scopes, delete google-drive-token.json.
  // SCOPES: ['https://www.googleapis.com/auth/drive.readonly'],
  SCOPES: ['https://www.googleapis.com/auth/drive'],
  SPACING_X: 300,
  SPACING_Y: 75,
  GOOGLE_DRIVE_API_REDIRECT_URI: 'urn:ietf:wg:oauth:2.0:oob'
};
