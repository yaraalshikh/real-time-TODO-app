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
  let checkBox = document.createElement("input");
  checkBox.name = todo.title;
  let p = document.createElement("p");
  deleteButton.className = "delbut";
  checkBox.type = "checkbox";
  if (todo.completed === true) {
    listItem.style = "color: green; text-decoration: line-through;";
    checkBox.checked = todo.completed;
  }
  deleteButton.innerHTML = "Delete";
  deleteButton.style = "float:right; padding:11px;";
  deleteButton.onclick = deleteTask;
  checkBox.onclick = completeTask;
  p.appendChild(checkBox);
  p.appendChild(listItemText);
  p.appendChild(deleteButton);
  listItem.append(p);
  list.append(listItem);
}

//function for complete tasks
function completeTask() {
    let check = this.parentNode;
    if (this.checked) {
      check.style = " text-decoration: line-through; color: #028602";
    } else {
      check.style = " text-decoration: none; color: #000";
    }
    server.emit("completeSingleTodo", this.name);
  }

  //fuction to check all tasks as completed
function completedAllTasks() {
    let element = document.getElementById("todo-list");
    checkboxes = document.getElementsByName("chkbox");
    element.style = "text-decoration: line-through; color: #028602";
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = todo.completed;
    }
    server.emit("completeAll");
  }

  // this function deletes existing task
let deleteTask = function () {
    //remove parent list item from the ul
    let listItem = this.parentNode;
    let UL = listItem.parentNode;
    let para = UL.parentNode;
    para.removeChild(UL);
    input.setAttribute("isDone", true);
    let title = listItem.childNodes[0];
    server.emit("deleteSingleTodo", title.name);
  };

  //function to delete all tasks
let deleteAllTask = function () {
    const ul = document.getElementById("todo-list");
    ul.innerHTML = "";
    input.setAttribute("isDone", true);
    localStorage.setItem("deleteAll", input.getAttribute("isDone"));
    server.emit("deleteAll");
  };

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
