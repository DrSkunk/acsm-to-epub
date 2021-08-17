var express = require("express");
var cors = require("cors");
const path = require("path");
const { exec } = require("child_process");
const { https } = require("follow-redirects");
const fs = require("fs");

var app = express();

const port = process.env.PORT || 3945;

var corsOptions = {
  origin: "http://example.com",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// https://github.com/BentonEdmondson/knock/releases/download/0.1.0-alpha/knock-0.1.0-alpha-x86_64-linux
const version = "0.1.0-alpha";
const filename = "knock-0.1.0-alpha-x86_64-linux";

const destination = path.join(process.cwd(), filename);
(async () => {
  try {
    await fs.promises.stat(destination);
  } catch (error) {
    console.log("knock is not downloaded yet.");
    await download();
  }
  app.listen(port, function () {
    console.log(`CORS-enabled web server listening on ${port}`);
  });
})();

function download() {
  const url = `https://github.com/BentonEdmondson/knock/releases/download/${version}/${filename}`;
  console.log("Downloading Knock version", version);
  console.log("Downloading from", url);
  var file = fs.createWriteStream(destination);
  return new Promise((resolve, reject) => {
    https
      .get(url, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          console.log("knock is downloaded.");
          fs.promises
            .chmod(destination, "755")
            .then(file.close(resolve)) // close() is async, call cb after close completes.
            .catch(reject);
        });
      })
      .on("error", function (err) {
        console.error(`problem downloading: ${err.message}`);
        // Handle errors
        fs.unlink(destination); // Delete the file async. (But we don't check the result)
        reject(err);
      });
  });
}

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
