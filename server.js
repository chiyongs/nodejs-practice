const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

const templateList = (list) => {
  let i = 0;
  let content = "<ul>";
  for (i = 0; i < list.length; i++) {
    content = content + `<li><a href="?id=${list[i]}">${list[i]}</a></li>`;
  }
  content = content + "</ul>";
  return content;
};

const templateHTML = (title, content, body, control) => {
  return `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${content}
    ${control} 
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
      fs.readdir("./data", (err, fileList) => {
        const list = templateList(fileList);
        const title = "Welcome";
        data = "Hello World";
        const template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>
          <p>${data}</p>`,
          `<a href="/create">Create</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", (err, fileList) => {
        const list = templateList(fileList);
        fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
          const title = queryData.id;
          const template = templateHTML(
            title,
            list,
            `<h2>${title}</h2>
          <p>${data}</p>`,
            `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (PATHNAME === "/create") {
    fs.readdir("./data", (err, fileList) => {
      const list = templateList(fileList);
      const title = "Web - Create";
      const template = templateHTML(
        title,
        list,
        `<form action="/create_process" method=POST>
        <p><input type = "text" placeholder="title" name="title"></p>
        <p><textarea name="content" placeholder="content"></textarea></p>
        <input type = "submit">
        </form>`,
        ""
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (PATHNAME === "/create_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
    });
    request.on("end", (data) => {
      const post = qs.parse(body);
      const title = post.title;
      const content = post.content;
      fs.writeFile(`data/${title}`, content, "utf8", (err) => {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (PATHNAME === "/update") {
    fs.readdir("./data", (err, fileList) => {
      const list = templateList(fileList);
      fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
        const title = queryData.id;
        const template = templateHTML(
          title,
          list,
          `<form action="/update_process" method=POST>
          <input type = "hidden" name="id" value="${title}"}>
        <p><input type = "text" placeholder="title" name="title" value="${title}"></p>
        <p><textarea name="content" placeholder="content">${data}</textarea></p>
        <input type = "submit">
        </form>`,
          ""
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (PATHNAME === "/update_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
    });
    request.on("end", (data) => {
      const post = qs.parse(body);
      const title = post.title;
      const id = post.id;
      const content = post.content;
      fs.rename(`data/${id}`, `data/${title}`, (err) => {
        fs.writeFile(`data/${title}`, content, "utf8", (err) => {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found!");
  }
});
server.listen(3000);
