module.exports = str => new Date(str.replace(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/, '$3-$2-$1'));
