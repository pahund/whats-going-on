const Synchronizer = require('./Synchronizer');
const fs = require('fs');
const { Todo, UNCHANGED } = require('../model');

jest.mock('fs');

const simpleMindId = '666';
const evernoteId = '777';
const title = 'Singen';
const done = false;
const changedDone = true;
const changedTitle1 = 'Tanzen';
const changedTitle2 = 'Lachen';
const deadline = '2019-01-01T02:00:00.000Z';
const changeDeadline1 = '2019-02-01T02:00:00.000Z';
const changeDeadline2 = '2019-03-01T02:00:00.000Z';
const url = 'https://ebaytech.berlin/';
const changedUrl1 = 'https://www.motor-talk.de/';
const changedUrl2 = 'https://www.kijijiautos.ca/';
const simpleMindWithNoItems = [];
const simpleMindWithOneItem = [new Todo({ title, simpleMind: { id: simpleMindId } })];
const simpleMindWithChangedTitle = [new Todo({ title: changedTitle1, simpleMind: { id: simpleMindId } })];
const simpleMindWithChangedDone = [new Todo({ title, done: changedDone, simpleMind: { id: simpleMindId } })];
const simpleMindWithChangedTitleAndDone = [
  new Todo({ title: changedTitle1, done: changedDone, simpleMind: { id: simpleMindId } })
];
const simpleMindWithDeadline = [new Todo({ title, simpleMind: { id: simpleMindId }, deadline })];
const simpleMindWithChangedDeadline = [
  new Todo({ title, simpleMind: { id: simpleMindId }, deadline: changeDeadline1 })
];
const simpleMindWithUrl = [new Todo({ title, simpleMind: { id: simpleMindId }, url })];
const simpleMindWithChangedUrl = [new Todo({ title, simpleMind: { id: simpleMindId }, url: changedUrl1 })];
const evernoteWithNoItems = [];
const evernoteWithOneItem = [new Todo({ title, evernote: { id: evernoteId } })];
const evernoteWithChangedTitle = [new Todo({ title: changedTitle2, evernote: { id: evernoteId } })];
const evernoteWithChangedDone = [new Todo({ title, done: changedDone, evernote: { id: evernoteId } })];
const evernoteWithChangedTitleAndDone = [
  new Todo({ title: changedTitle2, done: changedDone, evernote: { id: evernoteId } })
];
const evernoteWithDeadline = [new Todo({ title, evernote: { id: evernoteId }, deadline })];
const evernoteWithChangedDeadline = [new Todo({ title, evernote: { id: evernoteId }, deadline: changeDeadline2 })];
const evernoteWithUrl = [new Todo({ title, evernote: { id: evernoteId }, url })];
const evernoteWithChangedUrl = [new Todo({ title, evernote: { id: evernoteId }, url: changedUrl2 })];
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
    "done": ${done},
    "deadline": null,
    "url": null,
    "status": "${UNCHANGED}"
  }
]`;
const cacheWithDeadline = `[
  {
    "evernote": {
      "id": "${evernoteId}"
    },
    "simpleMind": {
      "id": "${simpleMindId}"
    },
    "title": "${title}",
    "done": ${done},
    "deadline": "${deadline}",
    "url": null,
    "status": "${UNCHANGED}"
  }
]`;
const cacheWithUrl = `[
  {
    "evernote": {
      "id": "${evernoteId}"
    },
    "simpleMind": {
      "id": "${simpleMindId}"
    },
    "title": "${title}",
    "done": ${done},
    "deadline": null,
    "url": "${url}",
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
    "done": ${done},
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
    "done": ${done},
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
  describe.each`
    description                                    | simpleMind                           | evernote                           | cache                | expectedSyncResult                                  | expectedCacheResult
    ${'the title was changed in Evernote'}         | ${simpleMindWithOneItem}             | ${evernoteWithChangedTitle}        | ${cacheWithOneItem}  | ${'the title should be changed in SimpleMind'}      | ${'contains the new title'}
    ${'the title was changed in SimpleMind'}       | ${simpleMindWithChangedTitle}        | ${evernoteWithOneItem}             | ${cacheWithOneItem}  | ${'the title should be changed in Evernote'}        | ${'contains the new title'}
    ${'the title was changed in both'}             | ${simpleMindWithChangedTitle}        | ${evernoteWithChangedTitle}        | ${cacheWithOneItem}  | ${'the title should be changed in Evernote'}        | ${'contains the SimpleMind title'}
    ${'done was changed in Evernote'}              | ${simpleMindWithOneItem}             | ${evernoteWithChangedDone}         | ${cacheWithOneItem}  | ${'done should be changed in SimpleMind'}           | ${'contains the new done'}
    ${'done was changed in SimpleMind'}            | ${simpleMindWithChangedDone}         | ${evernoteWithOneItem}             | ${cacheWithOneItem}  | ${'done should be changed in Evernote'}             | ${'contains the new done'}
    ${'title and done were changed in Evernote'}   | ${simpleMindWithOneItem}             | ${evernoteWithChangedTitleAndDone} | ${cacheWithOneItem}  | ${'title and done should be changed in SimpleMind'} | ${'contains the new done'}
    ${'title and done were changed in SimpleMind'} | ${simpleMindWithChangedTitleAndDone} | ${evernoteWithOneItem}             | ${cacheWithOneItem}  | ${'title and done should be changed in Evernote'}   | ${'contains the new done'}
    ${'a deadline was added in Evernote'}          | ${simpleMindWithOneItem}             | ${evernoteWithDeadline}            | ${cacheWithOneItem}  | ${'the deadline should be added in SimpleMind'}     | ${'contains the new deadline'}
    ${'the deadline was removed in Evernote'}      | ${simpleMindWithDeadline}            | ${evernoteWithOneItem}             | ${cacheWithDeadline} | ${'the deadline should be removed from SimpleMind'} | ${'does not contain the deadline'}
    ${'the deadline was changed in Evernote'}      | ${simpleMindWithDeadline}            | ${evernoteWithChangedDeadline}     | ${cacheWithDeadline} | ${'the deadline should be changed in SimpleMind'}   | ${'contains the new deadline'}
    ${'a deadline was added in SimpleMind'}        | ${simpleMindWithDeadline}            | ${evernoteWithOneItem}             | ${cacheWithOneItem}  | ${'the deadline should be added in Evernote'}       | ${'contains the new deadline'}
    ${'the deadline was removed in SimpleMind'}    | ${simpleMindWithOneItem}             | ${evernoteWithDeadline}            | ${cacheWithDeadline} | ${'the deadline should be removed in Evernote'}     | ${'does not contain the deadline'}
    ${'the deadline was changed in SimpleMind'}    | ${simpleMindWithChangedDeadline}     | ${evernoteWithDeadline}            | ${cacheWithDeadline} | ${'the deadline should be changed in Evernote'}     | ${'contains the new deadline'}
    ${'a deadline was added in both'}              | ${simpleMindWithChangedDeadline}     | ${evernoteWithChangedDeadline}     | ${cacheWithOneItem}  | ${'the deadline should be changed in Evernote'}     | ${'contains the SimpleMind deadline'}
    ${'the deadline was removed in both'}          | ${simpleMindWithOneItem}             | ${evernoteWithOneItem}             | ${cacheWithDeadline} | ${'nothing should be changed'}                      | ${'does not contain a deadline'}
    ${'the deadline was changed in both'}          | ${simpleMindWithChangedDeadline}     | ${evernoteWithChangedDeadline}     | ${cacheWithDeadline} | ${'the deadline should be changed in Evernote'}     | ${'contains the SimpleMind deadline'}
    ${'a URL was added in Evernote'}               | ${simpleMindWithOneItem}             | ${evernoteWithUrl}                 | ${cacheWithOneItem}  | ${'the URL should be added in SimpleMind'}          | ${'contains the new URL'}
    ${'the URL was removed in Evernote'}           | ${simpleMindWithUrl}                 | ${evernoteWithOneItem}             | ${cacheWithUrl}      | ${'the URL should be removed from SimpleMind'}      | ${'does not contain the URL'}
    ${'the URL was changed in Evernote'}           | ${simpleMindWithUrl}                 | ${evernoteWithChangedUrl}          | ${cacheWithUrl}      | ${'the URL should be changed in SimpleMind'}        | ${'contains the new URL'}
    ${'a URL was added in SimpleMind'}             | ${simpleMindWithUrl}                 | ${evernoteWithOneItem}             | ${cacheWithOneItem}  | ${'the URL should be added in Evernote'}            | ${'contains the new URL'}
    ${'the URL was removed in SimpleMind'}         | ${simpleMindWithOneItem}             | ${evernoteWithUrl}                 | ${cacheWithUrl}      | ${'the URL should be removed in Evernote'}          | ${'does not contain the URL'}
    ${'the URL was changed in SimpleMind'}         | ${simpleMindWithChangedUrl}          | ${evernoteWithUrl}                 | ${cacheWithUrl}      | ${'the URL should be changed in Evernote'}          | ${'contains the new URL'}
    ${'a URL was added in both'}                   | ${simpleMindWithChangedUrl}          | ${evernoteWithChangedUrl}          | ${cacheWithOneItem}  | ${'the URL should be changed in Evernote'}          | ${'contains the SimpleMind URL'}
    ${'the URL was removed in both'}               | ${simpleMindWithOneItem}             | ${evernoteWithOneItem}             | ${cacheWithUrl}      | ${'nothing should be changed'}                      | ${'does not contain a URL'}
    ${'the URL was changed in both'}               | ${simpleMindWithChangedUrl}          | ${evernoteWithChangedUrl}          | ${cacheWithUrl}      | ${'the URL should be changed in Evernote'}          | ${'contains the SimpleMind URL'}
  `('and $description', ({ description, simpleMind, evernote, cache, expectedSyncResult, expectedCacheResult }) => {
    let result;
    beforeEach(() => {
      console.log(description);
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(cache);
      synchronizer.loadCache();
      result = synchronizer.synchronize({ simpleMind, evernote });
      synchronizer.saveCache();
    });
    describe('the sync result', () => {
      it(`is that ${expectedSyncResult}`, () => expect(result).toMatchSnapshot());
    });
    describe('the cache', () => {
      it(expectedCacheResult, () => expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot());
    });
    afterEach(() => jest.clearAllMocks());
  });
});
