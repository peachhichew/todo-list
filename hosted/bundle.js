"use strict";

// https://www.w3schools.com/howto/howto_js_todolist.asp
// https://www.w3schools.com/css/css_form.asp
// https://www.w3schools.com/howto/howto_css_modals.asp

// code for modal
var modal = document.querySelector("#taskModal");
var newTaskButton = document.querySelector("#newTaskButton");
var span = document.getElementsByClassName("close")[0];

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

alert("helo");

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
      content.innerHTML = "<b>Create</b>";
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

  // if we are expecting a response body (not from HEAD request), parse it
  if (parseResponse) {
    parseJSON(xhr, content);
  } else if (typeof parseResponse === "undefined") {
    var obj = JSON.parse(xhr.response);
    console.dir(obj);
    content.innerHTML += "<p>Message: " + obj.message + "</p>";
  }
};

// send post request
var sendPost = function sendPost(e, nameForm) {
  // grab the form's action (url) and method (POST)
  var nameAction = nameForm.getAttribute("action");
  var nameMethod = nameForm.getAttribute("method");

  // grab age and name fields
  var nameField = nameForm.querySelector("#nameField");
  var ageField = nameForm.querySelector("#ageField");

  // create an ajax request
  var xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onload = function () {
    return handleResponse(xhr);
  };

  var formData = "name=" + nameField.value + "&age=" + ageField.value;
  xhr.send(formData);
  // prevent the browser from changing the page (default behavior)
  e.preventDefault();
  return false;
};

// function to send request
var requestUpdate = function requestUpdate(e, userForm) {
  var url = userForm.querySelector("#urlField").value;
  var method = userForm.querySelector("#methodSelect").value;

  // grab the form's action (url) and method (POST)
  var nameAction = nameForm.getAttribute("action");
  var nameMethod = nameForm.getAttribute("method");

  // grab age and name fields
  var nameField = nameForm.querySelector("#nameField");
  var ageField = nameForm.querySelector("#ageField");

  // create an ajax request
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
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
};

window.onload = init;
