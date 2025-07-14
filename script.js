const cheerSound = new Audio('mixkit-small-audience-weak-applause-521.wav');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', loadTasks);

addTaskBtn.addEventListener('click', () => {
  const task = taskInput.value.trim();
  const date = document.getElementById('due-date').value;
  const priority = document.getElementById('priority').value;

  if (task !== '') {
    const taskObj = {
      text: task,
      dueDate: date,
      priority: priority,
      completed: false
    };
    addTaskToDOM(taskObj);
    saveTask(taskObj);
    taskInput.value = '';
    document.getElementById('due-date').value = '';
    updateProgress();
  }
});

function addTaskToDOM(taskObj) {
  const li = document.createElement('li');
  if (taskObj.completed) li.classList.add('completed');

  const content = document.createElement('div');
  content.innerHTML = `
    <div><strong>${taskObj.text}</strong></div>
    <div class="task-meta">
      Due: ${taskObj.dueDate || 'No Date'} |
      <span class="priority-${taskObj.priority}">${taskObj.priority} Priority</span>
    </div>
  `;

  li.appendChild(content);

  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    taskObj.completed = !taskObj.completed;
    updateTaskInStorage(taskObj);
    updateProgress();
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.classList.add('delete');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTaskFromStorage(taskObj);
    li.remove();
    updateProgress();
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function saveTask(taskObj) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(taskObj);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTaskToDOM(task));
  updateProgress();
}

function deleteTaskFromStorage(taskToDelete) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(t => t.text !== taskToDelete.text);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInStorage(updatedTask) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.map(t => t.text === updatedTask.text ? updatedTask : t);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateProgress() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks.length === 0) {
      document.getElementById('progress-fill').style.width = '0%';
      document.getElementById('progress-count').textContent = '0';
      return;
    }
  
    const completed = tasks.filter(t => t.completed).length;
    const percent = Math.round((completed / tasks.length) * 100);
  
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-count').textContent = percent;
  
    // ✅ Check if all tasks are completed
    if (percent === 100) {
      // 🎉 Show confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
  
      // 🔊 Play cheering sound
      cheerSound.play();
    }
  }
  
