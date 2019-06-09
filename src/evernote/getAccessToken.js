const { rejectWithCustomMessage } = require("../utils");

module.exports = client => {
  return new Promise((resolve, reject) => {
    client.getRequestToken("CALLBACK_URL", (err, oauthToken, oauthSecret) => {
      console.log("authorization URL:", client.getAuthorizeUrl(oauthToken));

      if (err) {
        return rejectWithCustomMessage(
          "Failed to obtain OAuth token for Evernote",
          reject,
          err
        );
      }
      resolve({ oauthToken, oauthSecret });
    });
  });
};
