const { WhatsGoingOnError } = require('../../utils');
const isThriftError = require('./isThriftError');

module.exports = func => async (...args) => {
  try {
    return await func(...args);
  } catch (err) {
    if (isThriftError(err)) {
      switch (err.message) {
        case 'authenticationToken':
          throw new WhatsGoingOnError('Error – the authentication token for Evernote is invalid, try deleting it');
        case undefined:
          if (err.identifier === 'Notebook.guid') {
            throw new WhatsGoingOnError(`Error accessing Evernote: unknown notebook with ID ${err.key}`);
          }
          // see https://dev.evernote.com/doc/articles/revoked_expired_auth.php
          if (err.errorCode === 9 && err.parameter === 'authenticationToken') {
            throw new WhatsGoingOnError(`Error accessing Evernote: authentication token has expired`);
          }
          if (err.errorCode && err.parameter) {
            throw new WhatsGoingOnError(
              `Error accessing Evernote – error code ${err.errorCode}, parameter: ${err.parameter}`
            );
          }
          if (err.errorCode) {
            throw new WhatsGoingOnError(`Error accessing Evernote – error code ${err.errorCode}`);
          }
          throw new WhatsGoingOnError(`Error accessing Evernote`);
        default:
          throw new WhatsGoingOnError(`Error accessing Evernote: ${err.message}`);
      }
    } else {
      throw err;
    }
  }
};
