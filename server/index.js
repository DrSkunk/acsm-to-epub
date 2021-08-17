var express = require("express");
var cors = require("cors");
var app = express();

var corsOptions = {
  origin: "http://example.com",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.get("/", cors(corsOptions), function (req, res) {
  res.sendStatus(200);
});

app.get("/products/:id", cors(corsOptions), function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for only example.com." });
});

app.listen(3945, function () {
  console.log("CORS-enabled web server listening");
});

fetch("https://drskunk.duckdns.org:3945").then(console.log);
