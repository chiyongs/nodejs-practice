const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const pageRouter = require("./routes/page");
const indexRouter = require("./routes/index");
const app = express();
const helmet = require("helmet");
const port = 3000;

app.use(helmet());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get("*", (req, res, next) => {
  fs.readdir("./data", (err, fileList) => {
    req.list = fileList;
    next();
  });
});

app.use("/", indexRouter);
app.use("/page", pageRouter);

// 위의 함수들을 다 실행한 후에 라우팅에 맞는 함수가 없다는 것으로 판단되어서 매칭되는 것이 없으므로 404 error
app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
