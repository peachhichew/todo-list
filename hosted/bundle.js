"use strict";

// https://www.w3schools.com/howto/howto_js_todolist.asp
// https://www.w3schools.com/css/css_form.asp
// https://www.w3schools.com/howto/howto_css_modals.asp

// code for modal
var modal = document.querySelector("#taskModal");
var newTaskButton = document.querySelector("#newTaskButton");
var span = document.getElementsByClassName("close")[0];
var submitTask = document.querySelector("#submitTask");

newTaskButton.onclick = function () {
  console.log("button clicked");
  modal.style.display = "block";
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

var parseJSON = function parseJSON(xhr, content) {
  console.dir("parseJSON");
  var obj = JSON.parse(xhr.response);
  console.dir(obj);

  // if message in response, add it to the screen
  if (obj.message) {
    content.innerHTML += "<p>" + obj.message + "</p>";
  }

  if (obj.users) {
    var users = JSON.stringify(obj.users);
    content.innerHTML += "<p>" + users + "</p>";
  }
};

var handleResponse = function handleResponse(xhr, parseResponse) {
  var responseStatus = document.querySelector("#response-status");
  var todoLists = document.querySelector("#todo-lists");

  switch (xhr.status) {
    case 200:
      // success
      responseStatus.innerHTML = "<b>Todos retrieved successfully!</b>";
      todoLists.innerHTML += "<div class=\"single-todo\" id=\"single-todo\">\n      <h3 class=\"taskName-content\">" + xhr.response.taskName + "</h3>\n      <div class=\"status-and-dueDate\">\n        <p class=\"dueDate-content\">due date: " + xhr.response.dueDate + "</p>\n        <p class=\"status-content\">status: " + xhr.response.status + "</p>\n      </div>\n      <p class=\"taskDescription-content\">" + xhr.response.taskDescription + "</p>\n    </div>";
      break;
    case 201:
      // created
      responseStatus.innerHTML = "Todo created successfully!";
      break;
    case 204:
      // updated
      responseStatus.innerHTML = "<b>Updated (No Content) </b)";
      return;
    case 400:
      // bad request
      responseStatus.innerHTML = "<b>Bad Request</b>";
      break;
    case 404:
      // not found
      responseStatus.innerHTML = "<b>Resource Not found</b>";
      break;
    default:
      responseStatus.innerHTML = "Error code not implemented by client.";
      break;
  }
  console.log("parseResponse: ", parseResponse);
  console.log("xhr.response: ", xhr.response);

  // if we are expecting a response body (not from HEAD request), parse it
  if (parseResponse) {
    parseJSON(xhr, content);
    console.log("get request");
  } else if (typeof parseResponse === "undefined") {
    var obj = JSON.parse(xhr.response);
    console.dir(obj);
    todoLists.innerHTML += "<div class=\"single-todo\" id=\"single-todo\">\n    <h3 class=\"taskName-content\">" + obj.taskName + "</h3>\n    <div class=\"status-and-dueDate\">\n      <p class=\"dueDate-content\">due date: " + obj.dueDate + "</p>\n      <p class=\"status-content\">status: " + obj.status + "</p>\n    </div>\n    <p class=\"taskDescription-content\">" + obj.taskDescription + "</p>\n  </div>";
  }
};

// send post request
var sendPost = function sendPost(e, taskForm) {
  console.log("in sendPost");
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
  console.log("in requestUpdate()");

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

var init = function init() {
  var loadTodos = document.querySelector("#loadTodos");
  console.log("inside init()");
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
