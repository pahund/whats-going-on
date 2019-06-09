const { unlink } = require("fs");
const { SMMX_PATH } = require("./constants");

module.exports = () =>
  new Promise((resolve, reject) => {
    unlink(SMMX_PATH, err => {
      if (err) {
        err.message = `Failed to remove mind map file ${SMMX_PATH} – ${
          err.message
        }`;
        reject(err);
        return;
      }
      resolve();
    });
  });
