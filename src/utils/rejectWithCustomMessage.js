module.exports = (message, reject, err = new Error()) => {
  if (!err.message) {
    err.message = message;
    reject(err);
    return;
  }
  if (typeof err.message === "string") {
    err.message = `${message} – ${err.message}`;
    reject(err);
    return;
  }
  let str = "";
  err.message
    .on("data", s => (str += s))
    .on("end", () => {
      try {
        const finalErr = JSON.parse(str).error;
        finalErr.message = `${message} – ${finalErr.message}`;
        reject(finalErr);
      } catch (e) {
        reject(new Error(message));
      }
    });
};
