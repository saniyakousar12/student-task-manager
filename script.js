const KEY = "student-tasks";
let tasks = [];
let filter = "all";

const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");

function load() {
  try { tasks = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { tasks = []; }
}
function save() { localStorage.setItem(KEY, JSON.stringify(tasks)); }

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  input.value = "";
  save(); render();
}
function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) t.done = !t.done;
  save(); render();
}
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
}

function render() {
  list.innerHTML = "";
  const visible = tasks.filter(t =>
    filter === "all" || (filter === "completed" ? t.done : !t.done));
  visible.forEach(t => {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.done;
    cb.addEventListener("change", () => toggleTask(t.id));
    const span = document.createElement("span");
    span.textContent = t.text;
    span.addEventListener("click", () => toggleTask(t.id));
    const del = document.createElement("button");
    del.className = "del"; del.textContent = "Delete";
    del.addEventListener("click", () => deleteTask(t.id));
    li.append(cb, span, del);
    list.appendChild(li);
  });
  const pending = tasks.filter(t => !t.done).length;
  counter.textContent = `${pending} pending / ${tasks.length} total`;
}

document.getElementById("addBtn").addEventListener("click", addTask);
input.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });
document.querySelectorAll(".filter").forEach(btn =>
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === btn));
    render();
  }));

load(); render();
