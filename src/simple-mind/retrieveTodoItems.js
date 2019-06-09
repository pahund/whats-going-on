const xml2js = require("xml2js");
const parser = new xml2js.Parser();

const getTopics = data =>
  data["simplemind-mindmaps"].mindmap[0].topics[0].topic;

const filterTopicsForTodos = ({ $: { checkbox } }) => checkbox === "true";

const mapTopicsToTodoItems = ({ $: { text, date, progress, guid }, link }) => {
  const todoItem = {
    text: prepareTitle(text),
    done: progress === "100",
    guid
  };
  if (date) {
    todoItem.date = prepareDate(date);
  }
  if (link) {
    todoItem.url = link[0].$.urllink;
  }
  return todoItem;
};

const prepareDate = str =>
  new Date(str.replace(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/, "$3-$2-$1"));

const prepareTitle = title => title.replace(/\\N/g, " ");

module.exports = xml =>
  new Promise((resolve, reject) =>
    parser.parseString(xml, (err, data) => {
      if (err) {
        console.error("Error parsing mind map XML data", err);
        reject(err);
        return;
      }
      resolve(
        getTopics(data)
          .filter(filterTopicsForTodos)
          .map(mapTopicsToTodoItems)
      );
    })
  );
