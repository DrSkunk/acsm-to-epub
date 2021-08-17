var express = require("express");
var cors = require("cors");
const path = require("path");
const { exec } = require("child_process");

var app = express();

const port = process.env.PORT || 3945;

var corsOptions = {
  origin: "http://example.com",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.get("/", cors(corsOptions), function (req, res) {
  const ls = exec(
    path.join(process.cwd(), "knock-0.1.0-alpha-x86_64-linux"),
    function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log("Error code: " + error.code);
        console.log("Signal received: " + error.signal);
      }
      console.log("Child Process STDOUT: " + stdout);
      console.log("Child Process STDERR: " + stderr);
    }
  );

  ls.on("exit", function (code) {
    console.log("Child process exited with exit code " + code);
    res.sendStatus(200);
  });
  console.log(process.cwd());
});

app.get("/products/:id", cors(corsOptions), function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for only example.com." });
});

app.listen(port, function () {
  console.log(`CORS-enabled web server listening on ${port}`);
});
