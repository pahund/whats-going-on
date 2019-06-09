const { unlinkSync } = require("fs");
const { SMMX_PATH } = require("./constants");

module.exports = () => unlinkSync(SMMX_PATH);
