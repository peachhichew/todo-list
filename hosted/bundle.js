"use strict";

// https://www.w3schools.com/howto/howto_js_todolist.asp
// https://www.w3schools.com/css/css_form.asp
// https://www.w3schools.com/howto/howto_css_modals.asp
// https://stackoverflow.com/questions/15860683/onclick-event-in-a-for-loop

// code for modal
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

var singleTodo = document.getElementsByClassName("single-todo");
var taskName = void 0,
    dueDate = void 0,
    statusInModal = void 0,
    descrip = void 0;

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

  if (obj.todos) {
    console.log("inside obj.todos");
    var objKeys = Object.keys(obj["todos"]);
    // iterate through the todos object
    // for each key that exists, add a new todo element to the screen
    todoLists.innerHTML = "";
    for (var _i = 0; _i < Object.keys(obj["todos"]).length; _i++) {
      todoLists.innerHTML += "<div class=\"single-todo\" id=\"single-todo-" + obj.todos[objKeys[_i]]["id"] + "\">\n        <h3 class=\"taskName-content\">" + obj.todos[objKeys[_i]]["taskName"] + "</h3>\n        <div class=\"status-and-dueDate\">\n          <p class=\"dueDate-content\">due date: " + obj.todos[objKeys[_i]]["dueDate"] + "</p>\n          <p class=\"status-content\">status: " + obj.todos[objKeys[_i]]["status"] + "</p>\n        </div>\n        <p class=\"taskDescription-content\">" + obj.todos[objKeys[_i]]["taskDescription"] + "</p>\n      </div>";
    }

    for (var _i2 = 0; _i2 < singleTodo.length; _i2++) {
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
      })(_i2);
    }
  }

  if (obj.newTodos) {
    console.log("inside obj.newTodos");
    var _objKeys = Object.keys(obj["newTodos"]);
    // iterate through the todos object
    // for each key that exists, add a new todo element to the screen
    todoLists.innerHTML = "";
    for (var _i3 = 0; _i3 < Object.keys(obj["newTodos"]).length; _i3++) {
      todoLists.innerHTML += "<div class=\"single-todo\" id=\"single-todo-" + obj.newTodos[_objKeys[_i3]]["id"] + "\">\n        <h3 class=\"taskName-content\">" + obj.newTodos[_objKeys[_i3]]["taskName"] + "</h3>\n        <div class=\"status-and-dueDate\">\n          <p class=\"dueDate-content\">due date: " + obj.newTodos[_objKeys[_i3]]["dueDate"] + "</p>\n          <p class=\"status-content\">status: " + obj.newTodos[_objKeys[_i3]]["status"] + "</p>\n        </div>\n        <p class=\"taskDescription-content\">" + obj.newTodos[_objKeys[_i3]]["taskDescription"] + "</p>\n      </div>";
    }

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
    // console.log("get request");
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

var filterResults = function filterResults() {
  // let todoLists = document.querySelector("#todo-lists");
  // todoLists.innerHTML = "";
  var url = document.querySelector("#filter-dropdown").value;
  var method = document.querySelector("#filter-results").getAttribute("method");
  console.log("url: ", url);

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
