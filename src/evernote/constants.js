const { getPath } = require("../utils");

module.exports = {
  TOKEN_PATH: getPath("evernote-token.json"),
  CREDENTIALS_PATH: getPath("evernote-credentials.json"),
  REDIRECT_URL: "https://pahund.github.io/whats-going-on"
};
