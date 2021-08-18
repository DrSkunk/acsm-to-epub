const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const { https } = require("follow-redirects");

const { configDir } = require("./config");

const version = "0.1.0-alpha";
const knockFile = "knock-0.1.0-alpha-x86_64-linux";

const binaryPath = path.join(configDir, knockFile);
const knockConfigPath = path.join(configDir, "knock/device.xml");

async function init(originalFile) {
  try {
    await fs.promises.stat(binaryPath);
  } catch (error) {
    console.log("knock is not downloaded yet.");
    await download();
  }

  try {
    await fs.promises.stat(knockConfigPath);
  } catch (error) {
    const fullPath = path.join(__dirname, originalFile);
    throw new Error(
      `Run The following command: \n${binaryPath} ${fullPath}\nto setup your Adobe account.`
    );
  }
}

function download() {
  const url = `https://github.com/BentonEdmondson/knock/releases/download/${version}/${knockFile}`;
  console.log("Downloading Knock version", version);
  console.log("Downloading from", url);
  var file = fs.createWriteStream(binaryPath);
  return new Promise((resolve, reject) => {
    https
      .get(url, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          console.log("knock is downloaded.");
          fs.promises
            .chmod(binaryPath, "755")
            .then(file.close(resolve)) // close() is async, call cb after close completes.
            .catch(reject);
        });
      })
      .on("error", function (err) {
        console.error(`problem downloading: ${err.message}`);
        // Handle errors
        fs.unlink(binaryPath); // Delete the file async. (But we don't check the result)
        reject(err);
      });
  });
}

async function convert(inputFile) {
  const { stdout, stderr } = await exec(`"${binaryPath}" "${inputFile}"`);
  console.log(stdout);
  if (stderr) {
    console.error("stderr:", stderr);
  }

  return inputFile.slice(0, -4) + "epub";
}

module.exports = {
  init,
  convert,
};
