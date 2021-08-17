var express = require("express");
var cors = require("cors");
var app = express();

const port = process.env.PORT || 3945;

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

app.listen(port, function () {
  console.log(`CORS-enabled web server listening on ${port}`);
});
