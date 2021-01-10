const http = require("http");
const fs = require("fs");
const url = require("url");

const templateList = (list) => {
  let i = 0;
  let content = "<ul>";
  for (i = 0; i < list.length; i++) {
    content = content + `<li><a href="?id=${list[i]}">${list[i]}</a></li>`;
  }
  content = content + "</ul>";
  return content;
};

const templateHTML = (title, content, body) => {
  return `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${content}
    ${body}
  </body>
  </html>
  `;
};

const server = http.createServer(function (request, response) {
  //   const request.url = request.url;
  const queryData = url.parse(request.url, true).query;
  const PATHNAME = url.parse(request.url, true).pathname;

  if (PATHNAME === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (err, list) => {
        const content = templateList(list);
        const title = "Welcome";
        data = "Hello World";
        const template = templateHTML(
          title,
          content,
          `<h2>${title}</h2>
          <p>${data}</p>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", (err, list) => {
        const content = templateList(list);
        fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
          const title = queryData.id;
          const template = templateHTML(
            title,
            content,
            `<h2>${title}</h2>
          <p>${data}</p>`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end("Not Found!");
  }
});
server.listen(3000);
