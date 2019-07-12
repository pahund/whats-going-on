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
          throw new WhatsGoingOnError(`Error accessing Evernote`);
        default:
          throw new WhatsGoingOnError(`Error accessing Evernote: ${err.message}`);
      }
    } else {
      throw err;
    }
  }
};
