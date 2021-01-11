const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const template = require("./lib/template");

const server = http.createServer(function (request, response) {
  const queryData = url.parse(request.url, true).query;
  const PATHNAME = url.parse(request.url, true).pathname;

  if (PATHNAME === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", (err, fileList) => {
        const list = template.List(fileList);
        const title = "Welcome";
        data = "Hello World";
        const html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>
          <p>${data}</p>`,
          `<a href="/create">Create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir("./data", (err, fileList) => {
        const list = template.List(fileList);
        fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
          const title = queryData.id;
          const html = template.HTML(
            title,
            list,
            `<h2>${title}</h2>
          <p>${data}</p>`,
            `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a> <form action="delete_process" method = "POST" ><input type="hidden" name="id" value="${title}"><input type="submit" value="delete"></form>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (PATHNAME === "/create") {
    fs.readdir("./data", (err, fileList) => {
      const list = template.List(fileList);
      const title = "Web - Create";
      const html = template.HTML(
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
      response.end(html);
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
      const list = template.List(fileList);
      fs.readFile(`data/${queryData.id}`, "utf8", (err, data) => {
        const title = queryData.id;
        const html = template.HTML(
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
        response.end(html);
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
  } else if (PATHNAME === "/delete_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
    });
    request.on("end", (data) => {
      const post = qs.parse(body);
      const id = post.id;
      fs.unlink(`data/${id}`, (err) => {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found!");
  }
});
server.listen(3000);
