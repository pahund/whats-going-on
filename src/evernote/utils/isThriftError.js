const { Errors } = require('evernote');

module.exports = err =>
  err instanceof Errors.EDAMUserException ||
  err instanceof Errors.EDAMSystemException ||
  err instanceof Errors.EDAMNotFoundException ||
  err instanceof Errors.EDAMInvalidContactsException;
