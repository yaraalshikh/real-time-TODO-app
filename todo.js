module.exports = class Todo {
    constructor(title = "", completed, deleted = false) {
      this.title = title;
      this.completed = completed;
      this.deleted = deleted;
    }
  };