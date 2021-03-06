"use strict";

// Creating a CSS Modal:
// https://www.w3schools.com/howto/howto_css_modals.asp
// Attaching onclick event using a for loop:
// https://stackoverflow.com/questions/15860683/onclick-event-in-a-for-loop
// Background image from: https://unsplash.com/photos/PypjzKTUqLo

var modal = document.querySelector("#taskModal");
var newTaskButton = document.querySelector("#newTaskButton");
var span = document.getElementsByClassName("close")[0];
var submitTask = document.querySelector("#submitTask");
var todoForm = document.querySelector("#todoForm");

newTaskButton.onclick = function () {
  modal.style.display = "block";
  // clear the content inside the modal
  todoForm.reset();
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
};

submitTask.onclick = function () {
  modal.style.display = "none";
};

// display all todos from the JSON that is returned
var displayTodos = function displayTodos(obj, objTodos, todosName, todoLists) {
  var objKeys = Object.keys(obj[todosName]);
  todoLists.innerHTML = "";

  for (var i = 0; i < Object.keys(obj[todosName]).length; i++) {
    todoLists.innerHTML += "<div class=\"single-todo\" id=\"single-todo-" + objTodos[objKeys[i]]["id"] + "\">\n      <h3 class=\"taskName-content\">" + objTodos[objKeys[i]]["taskName"] + "</h3>\n      <div class=\"status-and-dueDate\">\n        <p class=\"dueDate-content\">due date: " + objTodos[objKeys[i]]["dueDate"] + "</p>\n        <p class=\"status-content\">status: " + objTodos[objKeys[i]]["status"] + "</p>\n      </div>\n      <p class=\"taskDescription-content\">" + objTodos[objKeys[i]]["taskDescription"] + "</p>\n    </div>";
  }
};

var singleTodo = document.getElementsByClassName("single-todo");
var taskName = void 0,
    dueDate = void 0,
    statusInModal = void 0,
    descrip = void 0;

// using the data from existing todos, we want to prefill the modal
// once the todo has been clicked
var prefillModal = function prefillModal() {
  for (var i = 0; i < singleTodo.length; i++) {
    (function (i) {
      singleTodo[i].onclick = function () {
        console.log("i: ", i);
        todoForm.reset();
        modal.style.display = "block";
        taskName = document.querySelector("#taskName");
        taskName.value = document.getElementsByClassName("taskName-content")[i].innerHTML;
        dueDate = document.querySelector("#dueDate");
        dueDate.value = document.getElementsByClassName("dueDate-content")[i].innerHTML.replace("due date: ", "");
        statusInModal = document.querySelector("#status");
        statusInModal.value = document.getElementsByClassName("status-content")[i].innerHTML.replace("status: ", "");
        descrip = document.querySelector("#taskDescription");
        descrip.value = document.getElementsByClassName("taskDescription-content")[i].innerHTML;
      };
    })(i);
  }
};

// prefill the default todo on the screen

var _loop = function _loop(i) {
  singleTodo[i].onclick = function () {
    console.log("i: ", i);
    todoForm.reset();
    modal.style.display = "block";
    taskName = document.querySelector("#taskName");
    taskName.value = document.getElementsByClassName("taskName-content")[0].innerHTML;
    dueDate = document.querySelector("#dueDate");
    dueDate.value = document.getElementsByClassName("dueDate-content")[0].innerHTML.replace("due date: ", "");
    statusInModal = document.querySelector("#status");
    statusInModal.value = document.getElementsByClassName("status-content")[0].innerHTML.replace("status: ", "");
    descrip = document.querySelector("#taskDescription");
    descrip.value = document.getElementsByClassName("taskDescription-content")[0].innerHTML;
  };
};

for (var i = 0; i < singleTodo.length; i++) {
  _loop(i);
}

var parseJSON = function parseJSON(xhr) {
  console.dir("parseJSON");
  var obj = JSON.parse(xhr.response);
  console.dir(obj);

  var todoLists = document.querySelector("#todo-lists");
  var responseStatus = document.querySelector("#response-status");

  // if message in response, add it to the screen
  if (obj.message) {
    responseStatus.innerHTML += "<p>" + obj.message + "</p>";
  }

  // used for filter that displays ALL todos
  if (obj.todos) {
    displayTodos(obj, obj.todos, "todos", todoLists);
    prefillModal();
  }

  // used when we are filtering for todos with specific statuses
  if (obj.newTodos) {
    displayTodos(obj, obj.newTodos, "newTodos", todoLists);
    prefillModal();
  }
};

var handleResponse = function handleResponse(xhr, parseResponse) {
  var responseStatus = document.querySelector("#response-status");
  var todoLists = document.querySelector("#todo-lists");

  switch (xhr.status) {
    case 200:
      // success
      responseStatus.innerHTML = "Todos retrieved successfully!";
      break;
    case 201:
      // created
      responseStatus.innerHTML = "Todo created successfully!";
      break;
    case 204:
      // updated
      responseStatus.innerHTML = "Updated todo! Refresh the todos list to see your changes.";
      return;
    case 400:
      // bad request
      responseStatus.innerHTML = "Bad Request (missing parameters)";
      break;
    case 404:
      // not found
      responseStatus.innerHTML = "Resource Not found";
      break;
    default:
      responseStatus.innerHTML = "Error code not implemented by client.";
      break;
  }

  // if we are expecting a response body (not from HEAD request), parse it
  if (parseResponse) {
    parseJSON(xhr);
  } else if (typeof parseResponse === "undefined") {
    var obj = JSON.parse(xhr.response);
    responseStatus.innerHTML += "<p>" + obj.message + "</p>";
    todoLists.innerHTML += "<div class=\"single-todo\" id=\"single-todo-" + obj.id + "\">\n    <h3 class=\"taskName-content\">" + obj.taskName + "</h3>\n    <div class=\"status-and-dueDate\">\n      <p class=\"dueDate-content\">due date: " + obj.dueDate + "</p>\n      <p class=\"status-content\">status: " + obj.status + "</p>\n    </div>\n    <p class=\"taskDescription-content\">" + obj.taskDescription + "</p>\n  </div>";
  }
};

// send post request
var sendPost = function sendPost(e, taskForm) {
  // console.log("in sendPost");
  // grab the form's action (url) and method (POST)
  var taskAction = taskForm.getAttribute("action");
  var taskMethod = taskForm.getAttribute("method");

  // grab fields from the form
  var taskNameField = taskForm.querySelector("#taskName");
  var dueDateField = taskForm.querySelector("#dueDate");
  var statusField = taskForm.querySelector("#status");
  // const checklistField = document.querySelector("#checklist");
  var taskDescriptionField = taskForm.querySelector("#taskDescription");

  // create an ajax request
  var xhr = new XMLHttpRequest();
  xhr.open(taskMethod, taskAction);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onload = function () {
    return handleResponse(xhr);
  };

  var formData = "taskName=" + taskNameField.value + "&dueDate=" + dueDateField.value + "&status=" + statusField.value + "&taskDescription=" + taskDescriptionField.value;
  console.dir("formData: ", formData);
  xhr.send(formData);
  // prevent the browser from changing the page (default behavior)
  e.preventDefault();
  return false;
};

// function to send request
var requestUpdate = function requestUpdate(e, loadTodos) {
  var url = loadTodos.getAttribute("action");
  var method = loadTodos.getAttribute("method");

  // create an ajax request
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");

  // check if GET or HEAD request
  if (method == "get") {
    // set onload to parse request and retrieve json message
    console.log("get request submitted");
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
  } else {
    // set onload to check meta data and NOT message
    // no body responses in a HEAD request
    xhr.onload = function () {
      return handleResponse(xhr, false);
    };
  }

  xhr.send();
  e.preventDefault();
  return false;
};

// send a GET request depending on what status is selected
var filterResults = function filterResults() {
  var url = document.querySelector("#filter-dropdown").value;
  var method = document.querySelector("#filter-results").getAttribute("method");

  // create an ajax request
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");

  console.log("get request submitted");
  xhr.onload = function () {
    return handleResponse(xhr, true);
  };
  xhr.send();
  // e.preventDefault();
  return false;
};

var init = function init() {
  var loadTodos = document.querySelector("#loadTodos");
  var retrieveTodos = function retrieveTodos(e) {
    return requestUpdate(e, loadTodos);
  };
  loadTodos.addEventListener("submit", retrieveTodos);

  var taskForm = document.querySelector("#todoForm");
  var addTodo = function addTodo(e) {
    return sendPost(e, taskForm);
  };
  taskForm.addEventListener("submit", addTodo);
};

window.onload = init;
