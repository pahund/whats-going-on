const fetch = require('node-fetch');
const { TIMEZONE_API_URI } = require('./constants');

module.exports = async () => {
  const key = process.env.TIMEZONE_API_KEY;
  const lat = process.env.TIMEZONE_LAT;
  const long = process.env.TIMEZONE_LONG;
  const uri = `${TIMEZONE_API_URI}?key=${key}&by=position&format=json&lat=${lat}&lng=${long}`;
  const { gmtOffset } = await fetch(uri).then(res => res.json());
  return gmtOffset;
};
