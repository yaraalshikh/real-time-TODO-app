const server = io("http://localhost:3003/");
const list = document.getElementById("todo-list");
const input = document.getElementById("todo-input");

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
let add = function () {
  // Emit the new todo as some data to the server
  server.emit("make", {
    title: input.value,
    completed: false,
    deleted: false,
  });

  // Clear the input
  input.value = "";
  // TODO: refocus the element
  input.focus();
};

//render when add element or loading
function render(todo) {
  const listItem = document.createElement("li");
  const listItemText = document.createTextNode(todo.title);

  let deleteButton = document.createElement("button");
  let p = document.createElement("p");
  deleteButton.className = "delbut";
  deleteButton.innerHTML = "Delete";
  p.appendChild(listItemText);
  p.appendChild(deleteButton);
  listItem.append(p);
  list.append(listItem);
}


function renderAllTodos(todos) {
  // once render would add all the incoming todos, the todo-list has to be clean
  list.innerHTML = "";

  todos.forEach((todo) => {
    render(todo);
  });
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on("load", (todos) => {
  // save for disconction
  renderAllTodos(todos);
});

// event for adding the new todo from the server
server.on("add", (todo) => {
  render(todo);
});
