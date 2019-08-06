const { getTopics, generateGuid, formatDate } = require('../utils');
const { SPACING_X, SPACING_Y } = require('../constants');

const calculateY = (topics, todos) => Number(topics[0].$.y) - ((todos.length - 1) / 2) * SPACING_Y;

module.exports = (data, todos) => {
  const topics = getTopics(data);
  let nextTopicId = topics.length;
  const x = Number(topics[0].$.x) + SPACING_X;
  let y = calculateY(topics, todos);
  const nextTodos = [];
  const nextData = {
    'simplemind-mindmaps': {
      mindmap: [
        {
          ...data['simplemind-mindmaps'].mindmap[0],
          topics: [
            {
              topic: getTopics(data).concat(
                todos.map(todo => {
                  const guid = generateGuid();
                  const nextTopic = {
                    $: {
                      id: `${nextTopicId}`,
                      parent: '0',
                      guid,
                      x: `${x}`,
                      y: `${y}`,
                      'checkbox-mode': 'checkbox',
                      progress: todo.done ? '100' : '0',
                      checkbox: 'true',
                      text: todo.title,
                      textfmt: 'plain'
                    }
                  };
                  if (todo.deadline) {
                    nextTopic.$.date = formatDate(todo.deadline);
                  }
                  if (todo.url) {
                    nextTopic.link = [
                      {
                        $: {
                          urllink: todo.url
                        }
                      }
                    ];
                  }
                  y += SPACING_Y;
                  nextTopicId++;
                  nextTodos.push(todo.change({ simpleMind: { id: guid } }));
                  return nextTopic;
                })
              )
            }
          ]
        }
      ]
    }
  };
  return [nextData, nextTodos];
};
