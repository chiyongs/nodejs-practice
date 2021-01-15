const express = require("express");
const router = express.Router();
const template = require("../lib/template");

router.get("/", (req, res) => {
  const title = "Welcome";
  const data = "Hello World";
  const list = template.List(req.list);
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>
        <p>${data}</p>
        <img src="/images/7.jpg" style="width:300px; display:block"/>`,
    `<a href="/page/create">Create</a>`
  );
  res.send(html);
});

module.exports = router;
