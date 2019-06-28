const Synchronizer = require('./Synchronizer');
const fs = require('fs');
const { Todo, UNCHANGED } = require('../model');

jest.mock('fs');

const simpleMindId = '666';
const evernoteId = '777';
const title = 'Singen';
const simpleMindWithNoItems = [];
const simpleMindWithOneItem = [new Todo({ title, simpleMind: { id: simpleMindId } })];
const evernoteWithNoItems = [];
const evernoteWithOneItem = [new Todo({ title, evernote: { id: evernoteId } })];
const cacheWithNoItems = '[]';
const cacheWithOneItem = `[
  {
    "evernote": {
      "id": "${evernoteId}"
    },
    "simpleMind": {
      "id": "${simpleMindId}"
    },
    "title": "${title}",
    "done": false,
    "deadline": null,
    "url": null,
    "status": "${UNCHANGED}"
  }
]`;
const todoListWithOneItem = [new Todo({ title, evernote: { id: evernoteId }, simpleMind: { id: simpleMindId } })];
const cacheWithEvernoteItem = `[
  {
    "evernote": {
      "id": "${evernoteId}"
    },
    "simpleMind": {
      "id": null
    },
    "title": "${title}",
    "done": false,
    "deadline": null,
    "url": null,
    "status": "${UNCHANGED}"
  }
]`;
const cacheWithSimpleMindItem = `[
  {
    "evernote": {
      "id": null
    },
    "simpleMind": {
      "id": "${simpleMindId}"
    },
    "title": "${title}",
    "done": false,
    "deadline": null,
    "url": null,
    "status": "${UNCHANGED}"
  }
]`;

describe('When I instantiate a synchronizer', () => {
  let synchronizer;
  beforeEach(() => (synchronizer = new Synchronizer()));
  describe.each`
    description               | hasCache | expectedCacheSize
    ${'no cache'}             | ${false} | ${0}
    ${'a cache with 2 todos'} | ${true}  | ${2}
  `('and there is $description', ({ hasCache, expectedCacheSize }) => {
    beforeEach(() => {
      if (hasCache) {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(`
          [
            { "title": "foo" },
            { "title": "bar" }
          ]
        `);
      } else {
        fs.existsSync.mockReturnValue(false);
      }
    });
    describe('and I load the cache', () => {
      beforeEach(() => synchronizer.loadCache());
      describe('the size of the cache', () => {
        let cacheSize;
        beforeEach(() => ({ cacheSize } = synchronizer.getTestStatus()));
        it(`is ${expectedCacheSize}`, () => expect(cacheSize).toEqual(expectedCacheSize));
      });
    });
  });
  describe.each`
    description                           | simpleMind               | cache               | evernote               | expectedResult                   | expectedCache
    ${'a todo was deleted in SimpleMind'} | ${simpleMindWithNoItems} | ${cacheWithOneItem} | ${evernoteWithOneItem} | ${'todo is removed Evernote'}    | ${'is empty'}
    ${'a todo was deleted in Evernote'}   | ${simpleMindWithOneItem} | ${cacheWithOneItem} | ${evernoteWithNoItems} | ${'todo is removed SimpleMind'}  | ${'is empty'}
    ${'a todo was added in SimpleMind'}   | ${simpleMindWithOneItem} | ${cacheWithNoItems} | ${evernoteWithNoItems} | ${'todo is added to Evernote'}   | ${'contains the todo'}
    ${'a todo was added in Evernote'}     | ${simpleMindWithNoItems} | ${cacheWithNoItems} | ${evernoteWithOneItem} | ${'todo is added to SimpleMind'} | ${'contains the todo'}
  `('and $description', ({ simpleMind, cache, evernote, expectedResult, expectedCache }) => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(cache);
    });
    describe('and I call the loadCache and synchronize functions', () => {
      let result;
      beforeEach(() => {
        synchronizer.loadCache();
        result = synchronizer.synchronize({ simpleMind, evernote });
      });
      describe('the result', () => {
        it(`is that ${expectedResult}`, () => {
          expect(result).toMatchSnapshot();
        });
      });
      describe('and I call the saveCache function', () => {
        beforeEach(() => synchronizer.saveCache());
        describe('the cache written to the local file system', () => {
          it(expectedCache, () => {
            expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
          });
        });
      });
    });
    afterEach(() => jest.clearAllMocks());
  });
  describe.each`
    description                                                                   | todos                    | cache                      | expected
    ${'Evernote and SimpleMind IDs and the cached item has only an Evernote ID'}  | ${todoListWithOneItem}   | ${cacheWithEvernoteItem}   | ${'contains the todo item with both IDs'}
    ${'Evernote and SimpleMind IDs and the cached item has only a SimpleMind ID'} | ${todoListWithOneItem}   | ${cacheWithSimpleMindItem} | ${'contains the todo item with both IDs'}
    ${'only an Evernote ID and the cached item has both'}                         | ${evernoteWithOneItem}   | ${cacheWithOneItem}        | ${'contains the todo item with both IDs'}
    ${'only a SimpleMind ID and the cached item has both'}                        | ${simpleMindWithOneItem} | ${cacheWithOneItem}        | ${'contains the todo item with both IDs'}
    ${'Evernote and SimpleMind IDs and the cache is empty'}                       | ${todoListWithOneItem}   | ${cacheWithNoItems}        | ${'is empty'}
  `(
    'and I call loadCache and updateCacheIds with a todo list with an item that has $description',
    ({ todos, cache, expected }) => {
      beforeEach(() => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(cache);
        synchronizer.loadCache();
        synchronizer.updateCacheIds(todos);
      });
      describe('and I call saveCache', () => {
        beforeEach(() => synchronizer.saveCache());
        describe('the cache written to the local file system', () => {
          it(expected, () => {
            expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
          });
        });
      });
      afterEach(() => jest.clearAllMocks());
    }
  );
});
