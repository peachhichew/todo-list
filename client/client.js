// https://www.w3schools.com/howto/howto_js_todolist.asp
// https://www.w3schools.com/css/css_form.asp
// https://www.w3schools.com/howto/howto_css_modals.asp

// code for modal
const modal = document.querySelector("#taskModal");
const newTaskButton = document.querySelector("#newTaskButton");
const span = document.getElementsByClassName("close")[0];
const submitTask = document.querySelector("#submitTask");

newTaskButton.onclick = () => {
  console.log("button clicked");
  modal.style.display = "block";
  // clear the content inside the modal
};

span.onclick = () => {
  modal.style.display = "none";
};

window.onclick = e => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
};

submitTask.onclick = () => {
  modal.style.display = "none";
};

// code to update each individual todo
const arrLength = document.getElementsByClassName("single-todo").length;

// use createElement instead for making the new elements
// for (let i = 0; i < arrLength; i++) {
//   console.log("initial load");
//   document
//     .getElementsByClassName("single-todo")
//     [i].addEventListener("click", e => {
//       console.log("index: " + i);
//     });
// }

const parseJSON = (xhr, content) => {
  console.dir("parseJSON");
  const obj = JSON.parse(xhr.response);
  console.dir(obj);

  const todoLists = document.querySelector("#todo-lists");
  // console.log("length", Object.keys(obj["todos"]).length);
  // console.log(Object.keys(obj["todos"]));
  // console.log(String(objKeys));
  // console.log("is string?", Object.keys(obj["todos"])[0] === typeof string);
  // console.log(obj.todos[objKeys[0]]["taskName"]);

  // if message in response, add it to the screen
  if (obj.message) {
    content.innerHTML += `<p>${obj.message}</p>`;
  }

  if (obj.todos) {
    const objKeys = Object.keys(obj["todos"]);
    // iterate through the todos object
    // for each key that exists, add a new todo element to the screen
    todoLists.innerHTML = "";
    for (let i = 0; i < Object.keys(obj["todos"]).length; i++) {
      todoLists.innerHTML += `<div class="single-todo" id="single-todo-${
        obj.todos[objKeys[i]]["id"]
      }">
        <h3 class="taskName-content">${obj.todos[objKeys[i]]["taskName"]}</h3>
        <div class="status-and-dueDate">
          <p class="dueDate-content">due date: ${
            obj.todos[objKeys[i]]["dueDate"]
          }</p>
          <p class="status-content">status: ${
            obj.todos[objKeys[i]]["status"]
          }</p>
        </div>
        <p class="taskDescription-content">${
          obj.todos[objKeys[i]]["taskDescription"]
        }</p>
      </div>`;
    }

    // for (let i = 0; i < arrLength; i++) {
    //   console.log("inside for loop");
    //   let str = `#single-todo-${obj.todos[objKeys[i]]["id"]}`;
    //   document.querySelector(str).addEventListener("click", e => {
    //     console.log("index: " + i);
    //   });
    // }
  }
};

const handleResponse = (xhr, parseResponse) => {
  const responseStatus = document.querySelector("#response-status");
  const todoLists = document.querySelector("#todo-lists");

  switch (xhr.status) {
    case 200: // success
      responseStatus.innerHTML = `Todos retrieved successfully!`;
      break;
    case 201: // created
      responseStatus.innerHTML = `Todo created successfully!`;
      break;
    case 204: // updated
      responseStatus.innerHTML = `Updated (No Content)`;
      return;
    case 400: // bad request
      responseStatus.innerHTML = `Bad Request`;
      break;
    case 404: // not found
      responseStatus.innerHTML = `Resource Not found`;
      break;
    default:
      responseStatus.innerHTML = `Error code not implemented by client.`;
      break;
  }

  // if we are expecting a response body (not from HEAD request), parse it
  if (parseResponse) {
    parseJSON(xhr, content);
    // console.log("get request");
  } else if (typeof parseResponse === "undefined") {
    const obj = JSON.parse(xhr.response);
    // console.dir(obj);
    todoLists.innerHTML += `<div class="single-todo" id="single-todo-${obj.id}">
    <h3 class="taskName-content">${obj.taskName}</h3>
    <div class="status-and-dueDate">
      <p class="dueDate-content">due date: ${obj.dueDate}</p>
      <p class="status-content">status: ${obj.status}</p>
    </div>
    <p class="taskDescription-content">${obj.taskDescription}</p>
  </div>`;
    // let element = `#single-todo-${obj.id}`;
    // document.querySelector(element).addEventListener("click", e => {
    //   console.log("event listener added to POST");
    // });
  }
};

// send post request
const sendPost = (e, taskForm) => {
  // console.log("in sendPost");
  // grab the form's action (url) and method (POST)
  const taskAction = taskForm.getAttribute("action");
  const taskMethod = taskForm.getAttribute("method");

  // grab fields from the form
  const taskNameField = taskForm.querySelector("#taskName");
  const dueDateField = taskForm.querySelector("#dueDate");
  const statusField = taskForm.querySelector("#status");
  // const checklistField = document.querySelector("#checklist");
  const taskDescriptionField = taskForm.querySelector("#taskDescription");

  // create an ajax request
  const xhr = new XMLHttpRequest();
  xhr.open(taskMethod, taskAction);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onload = () => handleResponse(xhr);

  const formData = `taskName=${taskNameField.value}&dueDate=${dueDateField.value}&status=${statusField.value}&taskDescription=${taskDescriptionField.value}`;
  console.dir("formData: ", formData);
  xhr.send(formData);
  // prevent the browser from changing the page (default behavior)
  e.preventDefault();
  return false;
};

// function to send request
const requestUpdate = (e, loadTodos) => {
  const url = loadTodos.getAttribute("action");
  const method = loadTodos.getAttribute("method");

  // create an ajax request
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");

  // check if GET or HEAD request
  if (method == "get") {
    // set onload to parse request and retrieve json message
    console.log("get request submitted");
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

const filterResults = () => {
  const url = document.querySelector("#filter-dropdown").value;
  const method = document
    .querySelector("#filter-results")
    .getAttribute("method");
  console.log("url: ", url);

  // create an ajax request
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");

  // // check if GET or HEAD request
  // if (method == "get") {
  //   // set onload to parse request and retrieve json message
  console.log("get request submitted");
  xhr.onload = () => handleResponse(xhr, true);
  // } else {
  //   // set onload to check meta data and NOT message
  //   // no body responses in a HEAD request
  //   xhr.onload = () => handleResponse(xhr, false);
  // }

  xhr.send();
  // e.preventDefault();
  return false;
};

const init = () => {
  const loadTodos = document.querySelector("#loadTodos");
  const retrieveTodos = e => requestUpdate(e, loadTodos);
  loadTodos.addEventListener("submit", retrieveTodos);

  const taskForm = document.querySelector("#todoForm");
  const addTodo = e => sendPost(e, taskForm);
  taskForm.addEventListener("submit", addTodo);
};

window.onload = init;
