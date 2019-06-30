const Todo = require('./Todo');
const { CHANGED, UNCHANGED } = require('./constants');

const title = 'my title';
const changedTitle = 'my changed title';
const evernoteId = '1224bdef3745ffa0';
const simpleMindId = '5f37ec4fa0097e';
const invalidId = 666;
const deadlineStr = '1971-10-10';
const deadline = new Date(deadlineStr);
const otherDeadline = new Date('1974-11-09');
const invalidDeadlineNum = 3434;
const invalidDeadlineStr = 'blabla';
const url = 'https://github.com';
const invalidUrl = 'blabla';
const doneTrue = true;
const doneTrueStr = 'true';
const doneFalse = false;
const doneFalseStr = 'false';
const order = 1561885947226;
const invalidOrder = 'foo';

describe('When I create a todo', () => {
  let todo;
  describe('with just a title', () => {
    beforeEach(() => (todo = new Todo({ title })));
    describe('the resulting todo', () => {
      it('has the correct title, done set to false and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with no title', () => {
    describe('an error', () => {
      it('is thrown', () => expect(() => new Todo({})).toThrow('Title needs to be set'));
    });
  });
  describe('with no arguments', () => {
    describe('an error', () => {
      it('is thrown', () => expect(() => new Todo({})).toThrow('Title needs to be set'));
    });
  });
  describe('with a title and an Evernote ID', () => {
    beforeEach(() => (todo = new Todo({ title, evernote: { id: evernoteId } })));
    describe('the resulting todo', () => {
      it('has the correct title and Evernote ID, done set to false and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and an undefined Evernote ID', () => {
    beforeEach(() => (todo = new Todo({ title, evernote: {} })));
    describe('the resulting todo', () => {
      it('has the correct title, done set to false and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and an invalid Evernote ID', () => {
    describe('an error', () => {
      it('is thrown', () =>
        expect(
          () =>
            new Todo({
              title,
              evernote: { id: invalidId }
            })
        ).toThrow('ID needs to be a string'));
    });
  });
  describe('with a title and an Evernote order', () => {
    beforeEach(() => (todo = new Todo({ title, evernote: { order } })));
    describe('the resulting todo', () => {
      it('has the correct title and Evernote order, done set to false and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and an undefined Evernote order', () => {
    beforeEach(() => (todo = new Todo({ title, evernote: {} })));
    describe('the resulting todo', () => {
      it('has the correct title, done set to false and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and an invalid Evernote order', () => {
    describe('an error', () => {
      it('is thrown', () =>
        expect(
          () =>
            new Todo({
              title,
              evernote: { order: invalidOrder }
            })
        ).toThrow('Evernote order needs to be a number'));
    });
  });
  describe('with a title and a SimpleMind ID', () => {
    beforeEach(() => (todo = new Todo({ title, simpleMind: { id: simpleMindId } })));
    describe('the resulting todo', () => {
      it('has the correct title and SimpleMind ID, done set to false and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and an undefined SimpleMind ID', () => {
    beforeEach(() => (todo = new Todo({ title, simpleMind: {} })));
    describe('the resulting todo', () => {
      it('has the correct title, done set to false and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and an invalid SimpleMind ID', () => {
    describe('an error', () => {
      it('is thrown', () =>
        expect(
          () =>
            new Todo({
              title,
              simpleMind: { id: invalidId }
            })
        ).toThrow('ID needs to be a string'));
    });
  });
  describe('with a title and a and status done set to true', () => {
    beforeEach(() => (todo = new Todo({ title, done: doneTrue })));
    describe('the resulting todo', () => {
      it('has the correct title, done set to true and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and a and status done set to string “true”', () => {
    beforeEach(() => (todo = new Todo({ title, done: doneTrueStr })));
    describe('the resulting todo', () => {
      it('has the correct title, done set to true and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and a and status done set to false', () => {
    beforeEach(() => (todo = new Todo({ title, done: doneFalse })));
    describe('the resulting todo', () => {
      it('has the correct title, done set to false and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and a and status done set to string “false”', () => {
    beforeEach(() => (todo = new Todo({ title, done: doneFalseStr })));
    describe('the resulting todo', () => {
      it('has the correct title, done set to false and everything else set to null', () =>
        expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and a valid deadline', () => {
    beforeEach(() => (todo = new Todo({ title, deadline })));
    describe('the resulting todo', () => {
      it('has the correct title and deadline', () => expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and a valid deadline string', () => {
    beforeEach(() => (todo = new Todo({ title, deadline: deadlineStr })));
    describe('the resulting todo', () => {
      it('has the correct title and deadline', () => expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and an invalid deadline string', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => new Todo({ title, deadline: invalidDeadlineStr })).toThrow('Deadline needs to be a date object');
      });
    });
  });
  describe('with a title and an invalid deadline number', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => new Todo({ title, deadline: invalidDeadlineNum })).toThrow('Deadline needs to be a date object');
      });
    });
  });
  describe('with a title and deadline set to undefined', () => {
    beforeEach(() => (todo = new Todo({ title, deadline: undefined })));
    describe('the resulting todo', () => {
      it('has the correct title and deadline set to null', () => expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and a valid URL', () => {
    beforeEach(() => (todo = new Todo({ title, url })));
    describe('the resulting todo', () => {
      it('has the correct title and URL', () => expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('with a title and an invalid URL', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => new Todo({ title, url: invalidUrl })).toThrow('URL is not valid format');
      });
    });
  });
  describe('with a title and URL set to undefined', () => {
    beforeEach(() => (todo = new Todo({ title, url: undefined })));
    describe('the resulting todo', () => {
      it('has the correct title and URL set to null', () => expect(todo).toMatchSnapshot());
      it('has change status UNCHANGED', () => expect(todo.status).toEqual(UNCHANGED));
    });
  });
  describe('and then clone it', () => {
    let original;
    let clone;
    beforeEach(() => {
      original = new Todo({
        title,
        done: doneTrue,
        deadline,
        url,
        evernote: { id: evernoteId },
        simpleMind: { id: simpleMindId }
      });
      clone = original.clone();
    });
    describe('the clone', () => {
      it('is deep equal to the original', () => expect(clone).toEqual(original));
      it('is a different instance than the original', () => {
        expect(clone).not.toBe(original);
      });
    });
  });
  describe('and try to change the title', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => (new Todo({ title }).title = 'new title')).toThrow(
          'Cannot set title, todos are immutable – use change instead'
        );
      });
    });
  });
  describe('and try to change the done state', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => (new Todo({ title }).done = true)).toThrow(
          'Cannot set done, todos are immutable – use change instead'
        );
      });
    });
  });
  describe('and try to change the URL', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => (new Todo({ title }).url = url)).toThrow(
          'Cannot set url, todos are immutable – use change instead'
        );
      });
    });
  });
  describe('and try to change the deadline', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => (new Todo({ title }).deadline = deadline)).toThrow(
          'Cannot set deadline, todos are immutable – use change instead'
        );
      });
    });
  });
  describe('and try to change the Evernote ID', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => (new Todo({ title }).evernoteId = evernoteId)).toThrow(
          'Cannot set evernoteId, todos are immutable – use change instead'
        );
      });
    });
  });
  describe('and try to change the Evernote order', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => (new Todo({ title }).evernoteOrder = order)).toThrow(
          'Cannot set evernoteOrder, todos are immutable – use change instead'
        );
      });
    });
  });
  describe('and try to change the SimpleMind ID', () => {
    describe('an error', () => {
      it('is thrown', () => {
        expect(() => (new Todo({ title }).simpleMindId = simpleMindId)).toThrow(
          'Cannot set simpleMindId, todos are immutable – use change instead'
        );
      });
    });
  });
  describe('and create a changed version', () => {
    describe('with a different title', () => {
      beforeEach(() => (todo = new Todo({ title }).change({ title: changedTitle })));
      describe('the new todo', () => {
        it('has the new title', () => {
          expect(todo).toMatchSnapshot();
          expect(todo.titleChanged).toBeTruthy();
        });
        it('has status CHANGED', () => expect(todo.status).toEqual(CHANGED));
      });
      describe('and then create a changed version', () => {
        describe('with a different done status', () => {
          beforeEach(() => (todo = todo.change({ done: doneTrue })));
          describe('the new todo', () => {
            it('has the new title and done status', () => {
              expect(todo.title).toBe(changedTitle);
              expect(todo.titleChanged).toBeTruthy();
              expect(todo.done).toBe(doneTrue);
              expect(todo.doneChanged).toBeTruthy();
            });
            it('has the sync status CHANGED', () => {
              expect(todo.status).toEqual(CHANGED);
            });
          });
        });
      });
    });
    describe('with a different done status', () => {
      describe('the new todo', () => {
        it('has the new done status', () => {
          const result = new Todo({ title }).change({ done: doneTrue });
          expect(result).toMatchSnapshot();
          expect(result.doneChanged).toBeTruthy();
        });
      });
    });
    describe('with a different Evernote ID', () => {
      describe('the new todo', () => {
        it('has the new Evernote ID', () => {
          expect(new Todo({ title }).change({ evernote: { id: evernoteId } })).toMatchSnapshot();
        });
      });
    });
    describe('with no Evernote ID while previously there was one', () => {
      describe('the new todo', () => {
        it('has no Evernote ID', () => {
          expect(
            new Todo({ title, evernote: { id: evernoteId } }).change({
              evernote: { id: null }
            })
          ).toMatchSnapshot();
        });
      });
    });
    describe('with a different Evernote order', () => {
      describe('the new todo', () => {
        it('has the new Evernote order', () => {
          expect(new Todo({ title }).change({ evernote: { order } })).toMatchSnapshot();
        });
      });
    });
    describe('with no Evernote order while previously there was one', () => {
      describe('the new todo', () => {
        it('has no Evernote order', () => {
          expect(
            new Todo({ title, evernote: { order } }).change({
              evernote: { order: null }
            })
          ).toMatchSnapshot();
        });
      });
    });
    describe('with a different SimpleMind ID', () => {
      describe('the new todo', () => {
        it('has the new SimpleMind ID', () => {
          expect(new Todo({ title }).change({ simpleMind: { id: simpleMindId } })).toMatchSnapshot();
        });
      });
    });
    describe('with no SimpleMind ID while previously there was one', () => {
      describe('the new todo', () => {
        it('has no SimpleMind ID', () => {
          expect(
            new Todo({ title, simpleMind: { id: simpleMindId } }).change({
              simpleMind: { id: null }
            })
          ).toMatchSnapshot();
        });
      });
    });
    describe('with a different deadline', () => {
      describe('the new todo', () => {
        it('has the new deadline', () => {
          expect(new Todo({ title }).change({ deadline })).toMatchSnapshot();
        });
      });
    });
    describe('with no deadline while previously there was one', () => {
      describe('the new todo', () => {
        it('has no deadline', () => {
          expect(
            new Todo({ title, deadline }).change({
              deadline: null
            })
          ).toMatchSnapshot();
        });
      });
    });
    describe('with a different URL', () => {
      describe('the new todo', () => {
        it('has the new URL', () => {
          expect(new Todo({ title }).change({ url })).toMatchSnapshot();
        });
      });
    });
    describe('with no URL while previously there was one', () => {
      describe('the new todo', () => {
        it('has no URL', () => {
          expect(
            new Todo({ title, url }).change({
              url: null
            })
          ).toMatchSnapshot();
        });
      });
    });
  });
  describe('and try to create a changed version', () => {
    describe('with no title', () => {
      describe('an error', () => {
        it('is thrown', () => {
          expect(() => new Todo({ title }).change({ title: null })).toThrow('Title needs to be set');
        });
      });
    });
    describe('with an invalid deadline', () => {
      describe('an error', () => {
        it('is thrown', () => {
          expect(() => new Todo({ title }).change({ deadline: invalidDeadlineNum })).toThrow(
            'Deadline needs to be a date object'
          );
        });
      });
    });
    describe('with an invalid URL', () => {
      describe('an error', () => {
        it('is thrown', () => {
          expect(() => new Todo({ title }).change({ url: invalidUrl })).toThrow('URL is not valid format');
        });
      });
    });
  });
  describe('with everything', () => {
    describe('when I convert it to JSON', () => {
      describe('the resulting object', () => {
        it('is a JavaScript object with all the todo properties', () => {
          expect(
            new Todo({
              title,
              done: doneTrue,
              evernote: { id: evernoteId },
              simpleMind: { id: simpleMindId },
              deadline,
              url
            })
          ).toMatchSnapshot();
        });
      });
    });
    describe('its string representation', () => {
      it('shows the title, done status, deadline, URL, SimpleMind ID and Evernote ID and order', () => {
        expect(
          new Todo({
            title,
            done: doneTrue,
            evernote: { id: evernoteId, order },
            simpleMind: { id: simpleMindId },
            deadline,
            url
          }).toString()
        ).toMatchSnapshot();
      });
    });
  });
});

describe.each`
  description                      | todo1                            | todo2                                           | expected
  ${'both without deadline'}       | ${new Todo({ title })}           | ${new Todo({ title })}                          | ${true}
  ${'one with a deadline'}         | ${new Todo({ title, deadline })} | ${new Todo({ title })}                          | ${false}
  ${'both with the same deadline'} | ${new Todo({ title, deadline })} | ${new Todo({ title, deadline })}                | ${true}
  ${'with different deadlines'}    | ${new Todo({ title, deadline })} | ${new Todo({ title, deadline: otherDeadline })} | ${false}
`('When I create two todos, $description', ({ todo1, todo2, expected }) => {
  describe('and check if they have the same deadline, the result', () => {
    let result;
    beforeEach(() => (result = todo1.hasSameDeadlineAs(todo2)));
    it(`is ${expected}`, () => expect(result).toBe(expected));
  });
});

describe.each`
  description                      | todo1                            | todo2                                           | expected
  ${'both without deadline'}       | ${new Todo({ title })}           | ${new Todo({ title })}                          | ${false}
  ${'one with a deadline'}         | ${new Todo({ title, deadline })} | ${new Todo({ title })}                          | ${true}
  ${'both with the same deadline'} | ${new Todo({ title, deadline })} | ${new Todo({ title, deadline })}                | ${false}
  ${'with different deadlines'}    | ${new Todo({ title, deadline })} | ${new Todo({ title, deadline: otherDeadline })} | ${true}
`('When I create two todos, $description', ({ todo1, todo2, expected }) => {
  describe('and check if they have different deadlines, the result', () => {
    let result;
    beforeEach(() => (result = todo1.hasDifferentDeadlineThan(todo2)));
    it(`is ${expected}`, () => expect(result).toBe(expected));
  });
});
