const todoInput = document.querySelector("#todo-input");
const addButton = document.querySelector("#add-button");
const todoForm = document.querySelector("#enter-todo");
const todoList = document.querySelector("#todo-list");
const doneList = document.querySelector("#done-list");

let todoStore = [];
let doneStore = [];

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addTodo();
});

function saveTodos() {
  localStorage.setItem("todoStore", JSON.stringify(todoStore));
  localStorage.setItem("doneStore", JSON.stringify(doneStore));
}

function deleteTodo(event) {
    event.stopPropagation();
    const todoItem = event.target.parentNode;
    const todoId = todoItem.id;
  
    if (todoItem.parentNode.id === "todo-list") {
      const index = todoStore.findIndex((todo) => todo.id === todoId);
      if (index !== -1) {
        todoStore.splice(index, 1);
      }
    } else {
      const index = doneStore.findIndex((done) => done.id === todoId);
      if (index !== -1) {
        doneStore.splice(index, 1);
      }
    }
    todoItem.remove();
    saveTodos();
  }
function addTodoItem(text, id, parentList, store) {

  const newTodo = document.createElement("li");
  const newTodoText = document.createTextNode(text);
  const deleteButton = document.createElement("button");

  deleteButton.textContent = "X";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", deleteTodo);

  newTodo.appendChild(newTodoText);
  newTodo.appendChild(deleteButton);
  newTodo.className = "todo-item";
  newTodo.addEventListener("click", switchTodo);
  newTodo.id = id;

  parentList.appendChild(newTodo);
  store.push({ text, id });
  saveTodos();
}

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText === "") {
    return;
  }
  const todoId = new Date().toISOString();

  addTodoItem(todoText, todoId, todoList, todoStore);

  todoInput.value = "";
}

function switchTodo(event) {
  let clickedTodo = event.currentTarget;
  const todoId = clickedTodo.id;
  
  if (clickedTodo.parentNode.id === "todo-list") {
    doneList.appendChild(clickedTodo);
    const todoIndex = todoStore.findIndex((todo) => todo.id === todoId);
    if (todoIndex !== -1) {
      const [movedTodo] = todoStore.splice(todoIndex, 1);
      doneStore.push(movedTodo);
    }
  } else {
    todoList.appendChild(clickedTodo);
    const doneIndex = doneStore.findIndex((done) => done.id === todoId);
    if (doneIndex !== -1) {
      const [movedDone] = doneStore.splice(doneIndex, 1);
      todoStore.push(movedDone);
    }
  }
  saveTodos();
}

function loadTodos() {
  const loadedTodoStore = JSON.parse(localStorage.getItem("todoStore"));
  const loadedDoneStore = JSON.parse(localStorage.getItem("doneStore"));

  loadedTodoStore.forEach((todo) => {
    addTodoItem(todo.text, todo.id, todoList, todoStore);
  });
  loadedDoneStore.forEach((done) => {
    addTodoItem(done.text, done.id, doneList, doneStore);
  });
}

addButton.addEventListener("click", addTodo);

loadTodos();
