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

const getTodos = (request, response) => {
  const responseJSON = {
    todos
  };

  // return status code 200 with message
  return respondJSON(request, response, 200, responseJSON);
};

// get meta info about the users and return a 200 status code
// const getUsersMeta = (request, response) =>
//   respondJSONMeta(request, response, 200);

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
    responseJSON.message = "Created Successfully";
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

// const addUser = (request, response, body) => {
//   const responseJSON = {
//     message: "Name and age are both required."
//   };

//   // check to make sure both fields are valid
//   if (!body.name || !body.age) {
//     responseJSON.id = "missingParams";
//     return respondJSON(request, response, 400, responseJSON);
//   }

//   // default status code to 201 created
//   let responseCode = 201;

//   // if user already exists, switch to 204 updated status
//   if (users[body.name]) {
//     responseCode = 204;
//   } else {
//     // else create a new user obj with that name
//     users[body.name] = {};
//   }

//   // add or update fields for this user name
//   users[body.name].name = body.name;
//   users[body.name].age = body.age;

//   // if the response is created, then change the message
//   // and sent response with a message
//   if (responseCode === 201) {
//     responseJSON.message = "Created Successfully";
//     return respondJSON(request, response, responseCode, responseJSON);
//   }

//   // 204 has empty payload so display success - no body
//   return respondJSONMeta(request, response, responseCode);
// };

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

module.exports = {
  getTodos,
  getTodosMeta,
  addTodo,
  notReal,
  notRealMeta
};
