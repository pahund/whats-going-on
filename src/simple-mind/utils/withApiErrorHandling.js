const { WhatsGoingOnError } = require('../../utils');
const { GaxiosError } = require('gaxios');

module.exports = async func => {
  try {
    return await func();
  } catch (err) {
    if (!(err instanceof GaxiosError)) {
      throw err;
    }
    const {
      error: { message }
    } = JSON.parse(
      await new Promise(resolve => {
        let str = '';
        err.message.on('data', s => (str += s)).on('end', () => resolve(str));
      })
    );
    throw new WhatsGoingOnError(`Error accessing Google Drive – ${message}`);
  }
};
