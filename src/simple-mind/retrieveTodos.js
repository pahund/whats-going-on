const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const { rejectWithCustomMessage } = require("../utils");
const { Todo } = require("../model");

const getTopics = data =>
  data["simplemind-mindmaps"].mindmap[0].topics[0].topic;

const filterTopicsForTodos = ({ $: { checkbox } }) => checkbox === "true";

const mapTopicsToTodoItems = ({ $: { text, date, progress, guid }, link }) =>
  new Todo({
    title: prepareTitle(text),
    done: progress === "100",
    simpleMind: { id: guid },
    deadline: date ? prepareDate(date) : null,
    url: link ? link[0].$.urllink : null
  });

const prepareDate = str =>
  new Date(str.replace(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/, "$3-$2-$1"));

const prepareTitle = title => title.replace(/\\N/g, " ");

module.exports = xml =>
  new Promise((resolve, reject) =>
    parser.parseString(xml, (err, data) => {
      if (err) {
        return rejectWithCustomMessage(
          "Error parsing mind map XML data",
          reject,
          err
        );
      }
      resolve(
        getTopics(data)
          .filter(filterTopicsForTodos)
          .map(mapTopicsToTodoItems)
      );
    })
  );
