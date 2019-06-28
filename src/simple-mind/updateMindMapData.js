const { getTopics } = require('./utils');

module.exports = (data, todos) => ({
  'simplemind-mindmaps': {
    mindmap: [
      {
        ...data['simplemind-mindmaps'].mindmap[0],
        topics: [
          {
            topic: getTopics(data).map(topic => {
              if (topic.$.checkbox !== 'true') {
                return topic;
              }
              const todo = todos.find(todo => todo.simpleMindId === topic.$.guid);
              const next = { ...topic };
              if (todo && todo.titleChanged) {
                next.$.text = todo.title;
              }
              return next;
            })
          }
        ]
      }
    ]
  }
});
