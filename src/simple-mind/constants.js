const { getPath } = require("../utils");

module.exports = {
  TOKEN_PATH: getPath("google-drive-token.json"),
  CREDENTIALS_PATH: getPath("google-drive-credentials.json"),
  SMMX_PATH: getPath("whats-going-on.smmx"),
  // If modifying these scopes, delete google-drive-token.json.
  SCOPES: ["https://www.googleapis.com/auth/drive.readonly"],
  FILE_ID: "1wDkYtOXUPn4eer9rfMWmYiSaAoPeEJaJ"
};
