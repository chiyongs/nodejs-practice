const express = require("express");
const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const template = require("./lib/template");
const bodyParser = require("body-parser");
const compression = require("compression");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get("*", (req, res, next) => {
  fs.readdir("./data", (err, fileList) => {
    req.list = fileList;
    next();
  });
});

//route, routing
app.get("/", (req, res) => {
  const title = "Welcome";
  const data = "Hello World";
  const list = template.List(req.list);
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>
      <p>${data}</p>
      <img src="/images/7.jpg" style="width:300px; display:block"/>`,
    `<a href="/create">Create</a>`
  );
  res.writeHead(200);
  res.end(html);
});

app.get("/page/:pageId", (req, res) => {
  const filteredID = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredID}`, "utf8", (err, data) => {
    const title = req.params.pageId;
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedData = sanitizeHtml(data);
    const list = template.List(req.list);
    const html = template.HTML(
      sanitizedTitle,
      list,
      `<h2>${sanitizedTitle}</h2>
      <p>${sanitizedData}</p>`,
      `<a href="/create">Create</a> <a href="/update/${sanitizedTitle}">Update</a>
        <form action="/delete_process" method = "POST" >
        <input type="hidden" name="id" value="${sanitizedTitle}">
        <input type="submit" value="delete">
        </form>`
    );
    res.send(html);
  });
});

app.get("/create", (req, res) => {
  const title = "Web - Create";
  const list = template.List(req.list);
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
  res.send(html);
});

app.post("/create_process", (req, res) => {
  const post = req.body;
  const title = post.title;
  const content = post.content;
  fs.writeFile(`data/${title}`, content, "utf8", (err) => {
    res.redirect(`page/${title}`);
  });
});

app.get("/update/:pageId", (req, res) => {
  const filteredID = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredID}`, "utf8", (err, data) => {
    const title = req.params.pageId;
    const list = template.List(req.list);
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
    res.send(html);
  });
});

app.post("/update_process", (req, res) => {
  const post = req.body;
  const id = post.id;
  const title = post.title;
  const content = post.content;
  fs.rename(`data/${id}`, `data/${title}`, (err) => {
    fs.writeFile(`data/${title}`, content, "utf8", (err) => {
      res.redirect(`page/${title}`);
    });
  });
});

app.post("/delete_process", (req, res) => {
  const post = req.body;
  const id = post.id;
  const filteredID = path.parse(id).base;
  fs.unlink(`data/${filteredID}`, (err) => {
    res.redirect("/");
  });
});

// 위의 함수들을 다 실행한 후에 라우팅에 맞는 함수가 없다는 것으로 판단되어서 매칭되는 것이 없으므로 404 error
app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
