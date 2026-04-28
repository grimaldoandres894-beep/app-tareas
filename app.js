let tasks = [];
let users = [];
let editId = null;

async function init() {
  await loadUsers();
  await loadTasks();
}
init();

// USERS
async function loadUsers() {
  const res = await fetch("http://localhost:3000/users");
  users = await res.json();

  const select = document.getElementById("userId");
  select.innerHTML = "<option value=''>Selecciona usuario</option>";

  users.forEach(u => {
    select.innerHTML += `<option value="${u.id}">${u.name}</option>`;
  });
}

async function addUser() {
  const name = document.getElementById("userName").value.trim();
  if (!name) return alert("Nombre vacío");

  await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name })
  });

  document.getElementById("userName").value = "";
  loadUsers();
}

// TASKS
async function loadTasks() {
  const res = await fetch("http://localhost:3000/tasks");
  tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(list) {
  const container = document.getElementById("tasks");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No hay resultados</p>";
    return;
  }

  list.forEach(t => {
    container.innerHTML += `
      <div class="task">
        <span>
          ID:${t.id} - ${t.title} (${t.name})
        </span>
        <button onclick="editTask(${t.id})">Editar</button>
      </div>
    `;
  });
}

// 🔥 GUARDAR (AGREGAR O EDITAR)
async function saveTask() {
  const title = document.getElementById("title").value.trim();
  const userId = document.getElementById("userId").value;

  if (!title || !userId) {
    return alert("Completa todos los campos");
  }

  const data = {
    title,
    user_id: Number(userId)
  };

  if (editId) {
    await fetch(`http://localhost:3000/tasks/${editId}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
  } else {
    await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
  }

  resetForm();
  await loadTasks();
}

// EDITAR REAL
function editTask(id) {
  const t = tasks.find(x => x.id === id);

  document.getElementById("title").value = t.title;
  document.getElementById("userId").value = t.user_id;

  editId = id;

  document.getElementById("formTitle").innerText = "Editando tarea...";
  document.getElementById("cancelBtn").style.display = "block";
}

// CANCELAR
function cancelEdit() {
  resetForm();
}

function resetForm() {
  editId = null;
  document.getElementById("title").value = "";
  document.getElementById("formTitle").innerText = "Agregar Tarea";
  document.getElementById("cancelBtn").style.display = "none";
}

// 🔥 BUSCADOR CORREGIDO (AHORA SÍ FUNCIONA)
function filterTasks() {
  const value = document.getElementById("search").value.trim().toLowerCase();

  if (!value) {
    renderTasks(tasks);
    return;
  }

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(value) ||   // nombre tarea
    String(t.id).includes(value) ||            // ID tarea
    String(t.user_id).includes(value) ||       // ID usuario
    t.name.toLowerCase().includes(value)       // nombre usuario
  );

  renderTasks(filtered);
}