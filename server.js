const http = require("http");
const fs = require("fs");
const url = require("url");
const server = http.createServer(function (request, response) {
  //   const request.url = request.url;
  const queryData = url.parse(request.url, true).query;
  const PATHNAME = url.parse(request.url, true).pathname;
  const title = queryData.id;

  if (PATHNAME === "/") {
    fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
      const template = `<!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              <ol>
                <li><a href="?id=HTML">HTML</a></li>
                <li><a href="?id=CSS">CSS</a></li>
                <li><a href="?id=JavaScript">JavaScript</a></li>
              </ol>
              <h2>${title}</h2>
              <p>${data}
              </p>
            </body>
            </html>
            `;
      response.writeHead(200);
      response.end(template);
    });
  } else {
    response.writeHead(404);
    response.end("Not Found!");
  }
});
server.listen(3000);
