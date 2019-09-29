const parseJSON = (xhr, content) => {
  console.dir("parseJSON");
  const obj = JSON.parse(xhr.response);
  console.dir(obj);

  // if message in response, add it to the screen
  if (obj.message) {
    content.innerHTML += `<p>${obj.message}</p>`;
  }

  if (obj.users) {
    const users = JSON.stringify(obj.users);
    content.innerHTML += `<p>${users}</p>`;
  }
};

const handleResponse = (xhr, parseResponse) => {
  const content = document.querySelector("#content");

  switch (xhr.status) {
    case 200: // success
      content.innerHTML = `<b>Success</b>`;
      break;
    case 201: // created
      content.innerHTML = `<b>Create</b>`;
      break;
    case 204: // updated
      content.innerHTML = `<b>Updated (No Content) </b)`;
      return;
    case 400: // bad request
      content.innerHTML = `<b>Bad Request</b>`;
      break;
    case 404: // not found
      content.innerHTML = `<b>Resource Not found</b>`;
      break;
    default:
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }
  console.log("parseResponse: ", parseResponse);

  // if we are expecting a response body (not from HEAD request), parse it
  if (parseResponse) {
    parseJSON(xhr, content);
  } else if (typeof parseResponse === "undefined") {
    const obj = JSON.parse(xhr.response);
    console.dir(obj);
    content.innerHTML += `<p>Message: ${obj.message}</p>`;
  }
};

// send post request
const sendPost = (e, nameForm) => {
  // grab the form's action (url) and method (POST)
  const nameAction = nameForm.getAttribute("action");
  const nameMethod = nameForm.getAttribute("method");

  // grab age and name fields
  const nameField = nameForm.querySelector("#nameField");
  const ageField = nameForm.querySelector("#ageField");

  // create an ajax request
  const xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onload = () => handleResponse(xhr);

  const formData = `name=${nameField.value}&age=${ageField.value}`;
  xhr.send(formData);
  // prevent the browser from changing the page (default behavior)
  e.preventDefault();
  return false;
};

// function to send request
const requestUpdate = (e, userForm) => {
  const url = userForm.querySelector("#urlField").value;
  const method = userForm.querySelector("#methodSelect").value;

  // grab the form's action (url) and method (POST)
  const nameAction = nameForm.getAttribute("action");
  const nameMethod = nameForm.getAttribute("method");

  // grab age and name fields
  const nameField = nameForm.querySelector("#nameField");
  const ageField = nameForm.querySelector("#ageField");

  // create an ajax request
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");

  // check if GET or HEAD request
  if (method == "get") {
    // set onload to parse request and retrieve json message
    xhr.onload = () => handleResponse(xhr, true);
  } else {
    // set onload to check meta data and NOT message
    // no body responses in a HEAD request
    xhr.onload = () => handleResponse(xhr, false);
  }

  xhr.send();
  e.preventDefault();
  return false;
};

const init = () => {
  const userForm = document.querySelector("#userForm");
  const getUsers = e => requestUpdate(e, userForm);
  userForm.addEventListener("submit", getUsers);

  const nameForm = document.querySelector("#nameForm");
  const addUser = e => sendPost(e, nameForm);
  nameForm.addEventListener("submit", addUser);
};

window.onload = init;
