const { getTopics, formatDate } = require('../utils');

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
              if (!todo) {
                return topic;
              }
              const next = { ...topic };
              if (todo.titleChanged) {
                next.$.text = todo.title;
              }
              if (todo.doneChanged) {
                next.$.progress = todo.done ? '100' : '0';
              }
              if (todo.deadlineChanged) {
                if (todo.deadline) {
                  next.$.date = formatDate(todo.deadline);
                } else {
                  Reflect.deleteProperty(next.$, 'date');
                }
              }
              if (todo.urlChanged) {
                if (todo.url) {
                  next.link = [
                    {
                      $: {
                        urllink: todo.url
                      }
                    }
                  ];
                } else {
                  Reflect.deleteProperty(next, 'link');
                }
              }
              return next;
            })
          }
        ]
      }
    ]
  }
});
