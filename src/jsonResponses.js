let count = 1;

const todos = {
  "print resume": {
    id: count,
    taskName: "print resume",
    dueDate: "2019-25-09",
    status: "not started",
    taskDescription: "head to library to print 20 copies of resume"
  }
};

let newTodos;

// function to response with a json object
const respondJSON = (request, response, status, object) => {
  const headers = {
    "Content-Type": "application/json"
  };

  // send response with json object
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
// takes request, response, and status code
const respondJSONMeta = (request, response, status) => {
  const headers = {
    "Content-Type": "application/json"
  };

  response.writeHead(status, headers);
  response.end();
};

const filterByStatus = (status, objKeys, todos) => {
  for (let i = 0; i < objKeys.length; i++) {
    let taskName = todos[objKeys[i]];
    if (todos[objKeys[i]]["status"] === status) {
      newTodos[taskName["taskName"]] = {};
      newTodos[taskName["taskName"]].id = taskName["id"];
      newTodos[taskName["taskName"]].taskName = taskName["taskName"];
      newTodos[taskName["taskName"]].dueDate = taskName["dueDate"];
      newTodos[taskName["taskName"]].status = taskName["status"];
      newTodos[taskName["taskName"]].taskDescription =
        taskName["taskDescription"];
    }
  }
};

const getTodos = (request, response, params) => {
  let responseJSON;
  const objKeys = Object.keys(todos);

  if (
    params.status !== "all" &&
    params.status !== "not-started" &&
    params.status !== "in-progress" &&
    params.status !== "done"
  ) {
    responseJSON = {
      message:
        "Missing valid query parameter set to not-started, in-progress, or done",
      id: "badRequest"
    };
    return respondJSON(request, response, 400, responseJSON);
  }

  if (params.status === "all") {
    responseJSON = { todos };
    console.log("responseJSON: ", responseJSON);
    return respondJSON(request, response, 200, responseJSON);
  } else if (params.status === "not-started") {
    newTodos = {};
    filterByStatus("not started", objKeys, todos, newTodos);
    responseJSON = { newTodos };
    console.log("return responseJSON: ", responseJSON);
  } else if (params.status === "in-progress") {
    newTodos = {};
    filterByStatus("in progress", objKeys, todos, newTodos);
    responseJSON = { newTodos };
    console.log("responseJSON: ", responseJSON);
  } else if (params.status === "done") {
    newTodos = {};
    filterByStatus("done", objKeys, todos, newTodos);
    responseJSON = { newTodos };
    console.log("responseJSON: ", responseJSON);
  }

  // return status code 200 with message
  return respondJSON(request, response, 200, responseJSON);
};

// get meta info about the users and return a 200 status code
const getTodosMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

const addTodo = (request, response, body) => {
  const responseJSON = {
    message: "All fields are required."
  };

  // check to make sure all fields are valid
  if (
    !body.taskName ||
    !body.dueDate ||
    !body.status ||
    !body.taskDescription
    // !body.checklist
  ) {
    responseJSON.id = "missingParams";
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 201 created
  let responseCode = 201;

  // if task already exists, switch to 204 updated status
  if (todos[body.taskName]) {
    responseCode = 204;
  } else {
    // else create a new user obj with that name
    todos[body.taskName] = {};
  }

  // add or update fields for this task name
  count++;
  todos[body.taskName].id = count;
  todos[body.taskName].taskName = body.taskName;
  todos[body.taskName].dueDate = body.dueDate;
  todos[body.taskName].status = body.status;
  todos[body.taskName].taskDescription = body.taskDescription;
  // todos[body.taskName].checklist = body.checklist;

  // if the response is created, then change the message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = "Your todo has been added.";
    responseJSON.id = count;
    responseJSON.taskName = body.taskName;
    responseJSON.dueDate = body.dueDate;
    responseJSON.status = body.status;
    responseJSON.taskDescription = body.taskDescription;
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // 204 has empty payload so display success - no body
  return respondJSONMeta(request, response, responseCode);
};

// function for 404 with message
const notReal = (request, response) => {
  const responseJSON = {
    message: "The page you are looking for was not found.",
    id: "notFound"
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notRealMeta = (request, response) =>
  respondJSONMeta(request, response, 404);

const badRequest = (request, response, params) => {
  const responseJSON = {
    message: "This request has the required parameters"
  };

  // if the mime type is json, check for the validity of the param and send
  // back an appropriate response
  if (
    !params.status ||
    params.status !== "not-started" ||
    params.status !== "in-progress" ||
    params.status !== "done"
  ) {
    responseJSON.message =
      "Missing valid query parameter set to not-started, in-progress, or done";
    responseJSON.id = "badRequest";
    return respondJSON(request, response, 400, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

module.exports = {
  getTodos,
  getTodosMeta,
  addTodo,
  notReal,
  notRealMeta,
  badRequest
};
