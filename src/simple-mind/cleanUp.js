const { unlink } = require('fs');
const { SMMX_PATH } = require('./constants');
const { rejectWithCustomMessage } = require('../utils');

module.exports = () =>
  new Promise((resolve, reject) => {
    unlink(SMMX_PATH, err => {
      if (err) {
        return rejectWithCustomMessage(`Failed to remove mind map file ${SMMX_PATH}`, reject, err);
      }
      resolve();
    });
  });
