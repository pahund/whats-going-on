const { SMMX_PATH } = require('../constants');

module.exports = async storage => await storage.delete(SMMX_PATH);
