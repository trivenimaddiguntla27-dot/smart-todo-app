const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

renderTodos();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();

  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(newTodo);

  saveTodos();
  renderTodos();

  input.value = "";
});

todoList.addEventListener("click", (e) => {
  const id = Number(e.target.closest("li")?.dataset.id);

  if (!id) return;

  // DELETE
  if (e.target.classList.contains("delete-btn")) {
    todos = todos.filter(todo => todo.id !== id);
  }

  // TOGGLE COMPLETE
  if (e.target.classList.contains("toggle-btn")) {
    todos = todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    );
  }

  // EDIT
  if (e.target.classList.contains("edit-btn")) {
    startEditing(id);
    return;
  }

  saveTodos();
  renderTodos();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    renderTodos();
  });
});

function renderTodos() {
  todoList.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter(todo => !todo.completed);
  }

  if (currentFilter === "completed") {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");

    li.dataset.id = todo.id;

    if (todo.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span>${todo.text}</span>

      <div class="actions">
        <button class="toggle-btn">
          ${todo.completed ? "Undo" : "Done"}
        </button>

        <button class="edit-btn">Edit</button>

        <button class="delete-btn">Delete</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

function startEditing(id) {
  const li = document.querySelector(`li[data-id="${id}"]`);

  const todo = todos.find(t => t.id === id);

  if (!todo || !li) return;

  li.innerHTML = `
    <input
      type="text"
      class="edit-input"
      value="${todo.text}"
    />

    <button class="save-btn">Save</button>
  `;

  const saveBtn = li.querySelector(".save-btn");
  const editInput = li.querySelector(".edit-input");

  saveBtn.addEventListener("click", () => {
    const updatedText = editInput.value.trim();

    if (!updatedText) return;

    todos = todos.map(t =>
      t.id === id
        ? { ...t, text: updatedText }
        : t
    );

    saveTodos();
    renderTodos();
  });
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}