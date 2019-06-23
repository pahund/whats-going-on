module.exports = async (arr, func, batchSize = 10, interval = 0) => {
  const result = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    const promises = arr.slice(i, i + batchSize).map(curr => func(curr));
    result.push(...(await Promise.all(promises)));
    if (interval) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  return result;
};
