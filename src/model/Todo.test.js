const Todo = require("./Todo");

const title = "my title";
const evernoteId = "1224bdef3745ffa0";
const simpleMindId = "5f37ec4fa0097e";
const invalidId = 666;
const deadline = new Date("1971-10-10");
const invalidDeadline = "blabla";
const url = 'https://github.com';
const invalidUrl = 'blabla';
const doneTrue = true;
const doneTrueStr = "true";
const doneFalse = false;
const doneFalseStr = "false";

describe("When I create a todo", () => {
  describe("with just a title", () => {
    describe("the resulting todo", () => {
      it("has the correct title, done set to false and everything else set to null", () =>
        expect(new Todo({ title })).toMatchSnapshot());
    });
  });
  describe("with no title", () => {
    describe("an error", () => {
      it("is thrown", () =>
        expect(() => new Todo({})).toThrow("Title needs to be set"));
    });
  });
  describe("with no arguments", () => {
    describe("an error", () => {
      it("is thrown", () =>
        expect(() => new Todo({})).toThrow("Title needs to be set"));
    });
  });
  describe("with a title and an Evernote ID", () => {
    describe("the resulting todo", () => {
      it("has the correct title and Evernote ID, done set to false and everything else set to null", () =>
        expect(
          new Todo({ title, evernote: { id: evernoteId } })
        ).toMatchSnapshot());
    });
  });
  describe("with a title and an undefined Evernote ID", () => {
    describe("the resulting todo", () => {
      it("has the correct title, done set to false and everything else set to null", () =>
        expect(new Todo({ title, evernote: {} })).toMatchSnapshot());
    });
  });
  describe("with a title and an invalid Evernote ID", () => {
    describe("an error", () => {
      it("is thrown", () =>
        expect(
          () =>
            new Todo({
              title,
              evernote: { id: invalidId }
            })
        ).toThrow("ID needs to be a string"));
    });
  });
  describe("with a title and a SimpleMind ID", () => {
    describe("the resulting todo", () => {
      it("has the correct title and SimpleMind ID, done set to false and everything else set to null", () =>
        expect(
          new Todo({ title, simpleMind: { id: simpleMindId } })
        ).toMatchSnapshot());
    });
  });
  describe("with a title and an undefined SimpleMind ID", () => {
    describe("the resulting todo", () => {
      it("has the correct title, done set to false and everything else set to null", () =>
        expect(new Todo({ title, simpleMind: {} })).toMatchSnapshot());
    });
  });
  describe("with a title and an invalid SimpleMind ID", () => {
    describe("an error", () => {
      it("is thrown", () =>
        expect(
          () =>
            new Todo({
              title,
              simpleMind: { id: invalidId }
            })
        ).toThrow("ID needs to be a string"));
    });
  });
  describe("with a title and a and status done set to true", () => {
    describe("the resulting todo", () => {
      it("has the correct title, done set to true and everything else set to null", () =>
        expect(new Todo({ title, done: doneTrue })).toMatchSnapshot());
    });
  });
  describe("with a title and a and status done set to string “true”", () => {
    describe("the resulting todo", () => {
      it("has the correct title, done set to true and everything else set to null", () =>
        expect(new Todo({ title, done: doneTrueStr })).toMatchSnapshot());
    });
  });
  describe("with a title and a and status done set to false", () => {
    describe("the resulting todo", () => {
      it("has the correct title, done set to false and everything else set to null", () =>
        expect(new Todo({ title, done: doneFalse })).toMatchSnapshot());
    });
  });
  describe("with a title and a and status done set to string “false”", () => {
    describe("the resulting todo", () => {
      it("has the correct title, done set to false and everything else set to null", () =>
        expect(new Todo({ title, done: doneFalseStr })).toMatchSnapshot());
    });
  });
  describe("with a title and a valid deadline", () => {
    describe("the resulting todo", () => {
      it("has the correct title and deadline", () =>
        expect(new Todo({ title, deadline })).toMatchSnapshot());
    });
  });
  describe("with a title and an invalid deadline", () => {
    describe("an error", () => {
      it("is thrown", () => {
        expect(() => new Todo({ title, deadline: invalidDeadline })).toThrow(
          "Deadline needs to be a date object"
        );
      });
    });
  });
  describe("with a title and deadline set to undefined", () => {
    describe("the resulting todo", () => {
      it("has the correct title and deadline set to null", () =>
        expect(new Todo({ title, deadline: undefined })).toMatchSnapshot());
    });
  });
  describe("with a title and a valid URL", () => {
    describe("the resulting todo", () => {
      it("has the correct title and URL", () =>
        expect(new Todo({ title, url })).toMatchSnapshot());
    });
  });
  describe("with a title and an invalid URL", () => {
    describe("an error", () => {
      it("is thrown", () => {
        expect(() => new Todo({ title, url: invalidUrl })).toThrow(
          "URL is not valid format"
        );
      });
    });
  });
  describe("with a title and URL set to undefined", () => {
    describe("the resulting todo", () => {
      it("has the correct title and URL set to null", () =>
        expect(new Todo({ title, url: undefined })).toMatchSnapshot());
    });
  });
});
