document.addEventListener("DOMContentLoaded", function () {
    flatpickr(".flatpickr", {
        enableTime: true,
        dateFormat: "d/m/Y H:i",
    });
});

document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskList = document.getElementById("taskList");
    var completionDateTime = flatpickr(".flatpickr").input.value;

    if (taskInput.value.trim() !== "" && completionDateTime.trim() !== "") {
        var task = {
            text: taskInput.value,
            completed: false,
            completionDateTime: new Date(completionDateTime).toLocaleString(),
        };

        saveTask(task);

        var li = createTaskElement(task);
        taskList.appendChild(li);
        taskInput.value = "";
        flatpickr(".flatpickr").clear(); // Limpa o campo de data e hora após adicionar a tarefa
    }
}


function createTaskElement(task) {
    var li = document.createElement("li");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;
        task.completedTimestamp = task.completed ? new Date().toLocaleString() : null;
        saveTask(task);
        updateTaskStyles(li, task);
    });

    var span = document.createElement("span");
    span.innerText = task.text;

    var completionSpan = document.createElement("span");
    completionSpan.innerText = " (Concluir até " + task.completionDateTime + ")";
    completionSpan.classList.add("completion-datetime");

    var button = document.createElement("button");
    button.innerText = "Remover";
    button.addEventListener("click", function () {
        removeTask(li, task);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(completionSpan);
    li.appendChild(button);

    updateTaskStyles(li, task);

    return li;
}

function updateTaskStyles(li, task) {
    var span = li.querySelector("span");

    if (task.completed) {
        span.classList.add("completed");
    } else {
        span.classList.remove("completed");
    }
}

function removeTask(li, task) {
    li.remove();
    removeTaskFromStorage(task);
}

function clearCompleted() {
    var taskList = document.getElementById("taskList");
    var completedTasks = Array.from(taskList.getElementsByClassName("completed"));

    completedTasks.forEach(function (completedTask) {
        completedTask.remove();
    });

    clearCompletedFromStorage();
}

function saveTask(task) {
    var tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTaskFromStorage(task) {
    var tasks = getTasksFromStorage();
    var index = tasks.findIndex(function (t) {
        return t.text === task.text && t.completed === task.completed;
    });

    if (index !== -1) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

function clearCompletedFromStorage() {
    var tasks = getTasksFromStorage();
    var uncompletedTasks = tasks.filter(function (task) {
        return !task.completed;
    });

    localStorage.setItem("tasks", JSON.stringify(uncompletedTasks));
}

function getTasksFromStorage() {
    var tasksString = localStorage.getItem("tasks");
    return tasksString ? JSON.parse(tasksString) : [];
}

function loadTasks() {
    var taskList = document.getElementById("taskList");
    var tasks = getTasksFromStorage();

    tasks.forEach(function (task) {
        var li = createTaskElement(task);
        taskList.appendChild(li);
    });
}
