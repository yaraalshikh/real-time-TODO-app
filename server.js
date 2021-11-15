const server = require("socket.io")();
const firstTodos = require("./data");
const Todo = require("./todo");
const fs = require("fs");

server.on("connection", (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db
    let DB = firstTodos.map((t) => {
      // Form new Todo objects
      return new Todo(
        (title = t.title),
        (completed = t.completed),
        (deleted = t.deleted)
      );
    });

  // FIXED: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
  const UpdateDB = () => {
    let rawData = fs.readFileSync("data.json", "utf8");
    let todosData = JSON.parse(rawData);
    DB = todosData;
  };

  let rawData = fs.readFileSync("data.json", "utf8");
  let todosData = JSON.parse(rawData);

  // Sends a message to the client to reload all todos
  const reloadTodos = () => {
    UpdateDB();
    server.emit("load", DB);
  };

    //send the new todo 
    const addTodo = (todo) => {
        server.emit("add", todo);
      };

      client.on("make", (t) => {
        // Make a new todo
        let NewTodo = new Todo(
          (title = t.title),
          (completed = t.completed),
          (deleted = t.deleted)
        );
        // Push this newly created todo to our database
        DB.push(NewTodo);
        todosData.push(NewTodo);
        fs.writeFileSync("data.json", JSON.stringify(todosData));
        // Send the latest todos to the client
        // FIXED: This sends all todos every time, could this be more efficient?
        addTodo(NewTodo);
      });

        //when a client cluck on complete all button
        client.on("completeAll", () => {
             let rawData = fs.readFileSync("data.json", "utf8");
              let todosData = JSON.parse(rawData);
              todosData.forEach((todo) => {
                   todo.completed = true;
                });
                fs.writeFileSync("data.json", JSON.stringify(todosData));
             });
      
             //when the client check to complete single todo
               client.on("completeSingleTodo", (todoTitle) => {
               let rawData = fs.readFileSync("data.json", "utf8");
               let todosData = JSON.parse(rawData);
               todosData.forEach((item) => {
                        if (item.title == todoTitle) {
                                 item.completed = true;
                                 return;
                                 }
                                });
                  fs.writeFileSync("data.json", JSON.stringify(todosData));
                });

                  // when the client click on delete single todo
                   client.on("deleteSingleTodo", (todoTitle) => {
                        let rawData = fs.readFileSync("data.json", "utf8");
                        let todosData = JSON.parse(rawData);
                        todosData = todosData.filter((item) => item.title !== todoTitle);
                        fs.writeFileSync("data.json", JSON.stringify(todosData));
                    });

    // Send the DB downstream on connect
        reloadTodos();
});

console.log('Waiting for clients to connect');

server.listen(3003);

