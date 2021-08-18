const config = require("./config.js");
const { GoogleDriveService } = require("./drive.js");

const mimeType = "application/epub+zip";

let drive;

function init() {
  const { clientId, clientSecret, redirectUri, refreshToken } =
    config.getConfig();

  drive = new GoogleDriveService(
    clientId,
    clientSecret,
    redirectUri,
    refreshToken
  );
}

async function testCredentials() {
  const { folderId } = config.getConfig();
  try {
    const test = await drive.testCredentials(folderId);
  } catch (error) {
    console.log(error);
    throw new Error(`Invalid google drive settings at ${config.configFile}`);
  }
}

function upload(fileName, path) {
  const { folderId } = config.getConfig();
  if (!drive) {
    throw new Error("Upload must be initialized first.");
  }
  return drive.saveFile(fileName, path, mimeType, folderId);
}

module.exports = {
  init,
  testCredentials,
  upload,
};
