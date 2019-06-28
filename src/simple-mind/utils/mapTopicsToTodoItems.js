const { Todo } = require('../../model');
const prepareDate = require('./prepareDate');
const prepareTitle = require('./prepareTitle');

module.exports = ({ $: { text, date, progress, guid }, link }) =>
  new Todo({
    title: prepareTitle(text),
    done: progress === '100',
    simpleMind: { id: guid },
    deadline: date ? prepareDate(date) : null,
    url: link ? link[0].$.urllink : null
  });
