const { getPath } = require("../utils");

module.exports = {
  TOKEN_PATH: getPath("evernote-token.json"),
  CREDENTIALS_PATH: getPath("evernote-credentials.json"),
  REDIRECT_URL: "https://pahund.github.io/whats-going-on",
  // ID of the notebook “02 Geschäftlich”
  NOTEBOOK_ID: "c531679d-4115-4443-9ae1-54f9d58c2da3",
  MAX_TODOS: 500
};
