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
  var content = document.querySelector("#content");

  switch (xhr.status) {
    case 200:
      // success
      content.innerHTML = "<b>Success</b>";
      break;
    case 201:
      // created
      content.innerHTML += "<b>Created Successfully</b>";
      break;
    case 204:
      // updated
      content.innerHTML = "<b>Updated (No Content) </b)";
      return;
    case 400:
      // bad request
      content.innerHTML = "<b>Bad Request</b>";
      break;
    case 404:
      // not found
      content.innerHTML = "<b>Resource Not found</b>";
      break;
    default:
      content.innerHTML = "Error code not implemented by client.";
      break;
  }
  console.log("parseResponse: ", parseResponse);
  console.log("xhr.response: ", xhr.response);

  // if we are expecting a response body (not from HEAD request), parse it
  if (parseResponse) {
    parseJSON(xhr, content);
  } else if (typeof parseResponse === "undefined") {
    var obj = JSON.parse(xhr.response);
    console.dir(obj);
    content.innerHTML += "<div class=\"single-todo\" id=\"single-todo\">\n    <h3 class=\"taskName-content\">" + obj.taskName + "</h3>\n    <div class=\"status-and-dueDate\">due date: " + obj.dueDate + "</p>\n      <p class=\"status-content\">status: " + obj.status + "</p>\n    </div>\n    <p class=\"taskDescription-content\">" + obj.taskDescription + "</p>\n  </div>";
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
var requestUpdate = function requestUpdate(e, taskForm) {
  // const url = userForm.querySelector("#urlField").value;
  // const method = userForm.querySelector("#methodSelect").value;

  // // grab the form's action (url) and method (POST)
  // const nameAction = nameForm.getAttribute("action");
  // const nameMethod = nameForm.getAttribute("method");

  // // grab age and name fields
  // const nameField = nameForm.querySelector("#nameField");
  // const ageField = nameForm.querySelector("#ageField");

  // grab the form's action (url) and method (POST)
  var taskAction = taskForm.getAttribute("action");
  var taskMethod = taskForm.getAttribute("method");

  // grab fields from the form
  var taskNameField = taskForm.querySelector("#taskName");
  var dueDateField = taskForm.querySelector("#dueDate");
  var statusField = taskForm.querySelector("#status");
  var taskDescription = taskForm.querySelector("#taskDescription");
  // const checklistField = taskForm.querySelector("#checklist");

  // create an ajax request
  var xhr = new XMLHttpRequest();
  xhr.open(taskMethod, taskAction);
  xhr.setRequestHeader("Accept", "application/json");

  // check if GET or HEAD request
  if (method == "get") {
    // set onload to parse request and retrieve json message
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
  // const userForm = document.querySelector("#userForm");
  // const getUsers = e => requestUpdate(e, userForm);
  // userForm.addEventListener("submit", getUsers);
  // const nameForm = document.querySelector("#nameForm");
  // const addUser = e => sendPost(e, nameForm);
  // nameForm.addEventListener("submit", addUser);

  var taskForm = document.querySelector("#todoForm");
  var addTodo = function addTodo(e) {
    return sendPost(e, taskForm);
  };
  taskForm.addEventListener("submit", addTodo);
};

window.onload = init;
