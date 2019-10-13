const fs = require("fs");

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const jsBundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const bgImg = fs.readFileSync(
  `${__dirname}/../hosted/clean-minimalist-office.jpg`
);

const getIndex = (request, response) => {
  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { "Content-Type": "text/css" });
  response.write(css);
  response.end();
};

const getBundle = (request, response) => {
  response.writeHead(200, { "Content-Type": "application/javascript" });
  response.write(jsBundle);
  response.end();
};

const getBgImg = (request, response) => {
  response.writeHead(200, { "Content-Type": "image/jpeg" });
  response.write(bgImg);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBundle,
  getBgImg
};
