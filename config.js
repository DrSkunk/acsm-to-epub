const fs = require("fs");
const path = require("path");
const os = require("os");

const knockConfigDir = path.join(os.homedir(), ".config/knock");
const configDir = path.join(os.homedir(), ".config/acsmtoepub");
const booksDir = path.join(configDir, "epubs");
const configFile = path.join(configDir, "settings.json");

const emptyConfig = {
  clientId: "",
  clientSecret: "",
  refreshToken: "",
  redirectUri: "",
  folderId: "",
};

let config;

async function init() {
  await fs.promises.mkdir(booksDir, {
    recursive: true,
  });
  try {
    config = JSON.parse(
      await fs.promises.readFile(configFile, { encoding: "utf8" })
    );
  } catch (error) {
    await fs.promises.writeFile(
      configFile,
      JSON.stringify(emptyConfig, null, 2),
      {
        encoding: "utf8",
      }
    );
    throw new Error(
      `Open config file ${configFile} and fill in config details`
    );
  }
}

function getConfig() {
  if (!config) {
    throw new Error("Config must be first initialized");
  }
  return config;
}

module.exports = {
  init,
  knockConfigDir,
  configDir,
  booksDir,
  configFile,
  getConfig,
};
