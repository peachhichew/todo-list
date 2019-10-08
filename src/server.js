const http = require("http");
const url = require("url");
const query = require("querystring");
const htmlHandler = require("./htmlResponses.js");
const jsonHandler = require("./jsonResponses.js");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === "/addTodo") {
    const res = response;

    // uploads come in as a byte stream that we need to
    // reassemble once it's all arrived
    const body = [];

    // send back a bad request if there's an error
    request.on("error", err => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // on 'data' is for each byte of data that comes in from the
    // upload. add it to the byte array
    request.on("data", chunk => {
      body.push(chunk);
    });

    // on the end of the upload stream
    request.on("end", () => {
      // combine to byte array and convert it to a string
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addTodo(request, res, bodyParams);
    });
  }
};

// handle GET request
const handleGet = (request, response, parsedUrl, params) => {
  if (parsedUrl.pathname === "/style.css") {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === "/getTodos") {
    console.log("params: ", params);
    jsonHandler.getTodos(request, response, params);
  } else if (parsedUrl.pathname === "/notReal") {
    jsonHandler.notReal(request, response, params);
  } else if (parsedUrl.pathname === "/bundle.js") {
    htmlHandler.getBundle(request, response);
  } else if (parsedUrl.pathname === "/") {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === "/badRequest") {
    jsonHandler.badRequest(request, response, params);
  } else {
    // htmlHandler.getIndex(request, response);
    jsonHandler.notReal(request, response);
  }
};

const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === "/getTodos") {
    jsonHandler.getTodosMeta(request, response);
  } else if (parsedUrl.pathname === "/notReal") {
    jsonHandler.notRealMeta(request, response);
  } else if (
    parsedUrl.pathname !== "/getUsers" &&
    parsedUrl.pathname !== "/notReal"
  ) {
    jsonHandler.notRealMeta(request, response);
  } else {
    jsonHandler.notRealMeta(request, response);
  }
};

// handles http requests
const onRequest = (request, response) => {
  console.log(request.url);
  // parse the url and grab the query parameters
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  if (request.method === "POST") {
    handlePost(request, response, parsedUrl, params);
  } else if (request.method === "HEAD") {
    handleHead(request, response, parsedUrl, params);
  } else {
    handleGet(request, response, parsedUrl, params);
  }
};

// start the server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
