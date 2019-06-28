module.exports = date => {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = `${date.getFullYear()}`.padStart(4, '0'); // just in case the deadline was in the medieval ages
  return `${day}-${month}-${year}`;
};
