const http = require("http");
const url = require("url");
const query = require("querystring");
const htmlHandler = require("./htmlResponses.js");
const jsonHandler = require("./jsonResponses.js");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === "/addUser") {
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

      jsonHandler.addUser(request, res, bodyParams);
    });
  }
};

// handle GET request
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === "/style.css") {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === "/getUsers") {
    jsonHandler.getUsers(request, response);
  } else if (parsedUrl.pathname === "/notReal") {
    jsonHandler.notReal(request, response);
  } else if (parsedUrl.pathname === "/bundle.js") {
    htmlHandler.getBundle(request, response);
  } else if (
    parsedUrl.pathname !== "/style.css" &&
    parsedUrl.pathname !== "/getUsers" &&
    parsedUrl.pathname !== "/notReal" &&
    parsedUrl.pathname !== "/" &&
    parsedUrl.pathname !== "/bundle.js"
  ) {
    jsonHandler.notReal(request, response);
  } else {
    htmlHandler.getIndex(request, response);
  }
};

const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === "/getUsers") {
    jsonHandler.getUsersMeta(request, response);
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

  if (request.method === "POST") {
    handlePost(request, response, parsedUrl);
  } else if (request.method === "HEAD") {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

// start the server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
