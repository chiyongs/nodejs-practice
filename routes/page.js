const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");
const template = require("../lib/template");
const bodyParser = require("body-parser");
const compression = require("compression");

router.get("/create", (req, res) => {
  const title = "Web - Create";
  const list = template.List(req.list);
  const html = template.HTML(
    title,
    list,
    `<form action="/page/create_process" method=POST>
            <p><input type = "text" placeholder="title" name="title"></p>
            <p><textarea name="content" placeholder="content"></textarea></p>
            <input type = "submit">
            </form>`,
    ""
  );
  res.send(html);
});

router.post("/create_process", (req, res) => {
  const post = req.body;
  const title = post.title;
  const content = post.content;
  fs.writeFile(`data/${title}`, content, "utf8", (err) => {
    res.redirect(`/page/${title}`);
  });
});

router.get("/update/:pageId", (req, res) => {
  const filteredID = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredID}`, "utf8", (err, data) => {
    const title = req.params.pageId;
    const list = template.List(req.list);
    const html = template.HTML(
      title,
      list,
      `<form action="/page/update_process" method=POST>
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

router.post("/update_process", (req, res) => {
  const post = req.body;
  const id = post.id;
  const title = post.title;
  const content = post.content;
  fs.rename(`data/${id}`, `data/${title}`, (err) => {
    fs.writeFile(`data/${title}`, content, "utf8", (err) => {});
  });
});

router.post("/delete_process", (req, res) => {
  const post = req.body;
  const id = post.id;
  const filteredID = path.parse(id).base;
  fs.unlink(`data/${filteredID}`, (err) => {
    res.redirect("/");
  });
});

router.get("/:pageId", (req, res, next) => {
  const filteredID = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredID}`, "utf8", (err, data) => {
    if (err) {
      next(err);
    } else {
      const title = req.params.pageId;
      const sanitizedTitle = sanitizeHtml(title);
      const sanitizedData = sanitizeHtml(data);
      const list = template.List(req.list);
      const html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>
          <p>${sanitizedData}</p>`,
        `<a href="/page/create">Create</a> <a href="/page/update/${sanitizedTitle}">Update</a>
            <form action="/page/delete_process" method = "POST" >
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
            </form>`
      );
      res.send(html);
    }
  });
});

module.exports = router;
