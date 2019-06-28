const LENGTH = 22;
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

const getRandomInt = (min, max) => {
  const cmin = Math.ceil(min);
  const fmax = Math.floor(max);
  return Math.floor(Math.random() * (fmax - cmin)) + cmin;
};

const getRandomChar = () => CHARS.substr(getRandomInt(0, CHARS.length), 1);

const generateGuid = () => {
  let result = '';
  for (let i = 0; i < LENGTH; i++) {
    result += getRandomChar();
  }
  return result;
};

module.exports = generateGuid;
