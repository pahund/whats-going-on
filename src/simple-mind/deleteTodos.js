const { getTopics } = require('./utils');

module.exports = (data, todos) => ({
  'simplemind-mindmaps': {
    mindmap: [
      {
        ...data['simplemind-mindmaps'].mindmap[0],
        topics: [
          {
            topic: getTopics(data).filter(topic => {
              if (topic.$.checkbox !== 'true') {
                return true;
              }
              const todo = todos.find(todo => todo.simpleMindId === topic.$.guid);
              return todo === undefined;
            })
          }
        ]
      }
    ]
  }
});
