#!/usr/bin/env node

console.log("Starting acsm-to-epub...");
const fs = require("fs");
const path = require("path");

const xml2js = require("xml2js");

const upload = require("./upload");
const knock = require("./knock");
const config = require("./config");

(async () => {
  try {
    await config.init();
    upload.init();
    await upload.testCredentials();

    if (process.argv.length < 3 || path.extname(process.argv[2]) !== ".acsm") {
      throw new Error("Usage: acsmtoepub <file.acsm>");
    }

    const originalFile = process.argv[2];
    await knock.init(originalFile);

    const cleanName = await getCleanName(originalFile);
    const acsmPath = path.join(config.booksDir, cleanName);
    await fs.promises.copyFile(originalFile, acsmPath);

    console.log("Copied to", acsmPath);
    const epubPath = await knock.convert(acsmPath);
    console.log("Converted to", epubPath);
    await upload.upload(cleanName, epubPath);
    console.log("uploaded file to Drive");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

async function getCleanName(inputFile) {
  console.log("Reading", inputFile);
  const input = await fs.promises.readFile(inputFile, { encoding: "utf8" });
  const xml = await xml2js.parseStringPromise(input);
  const metadata = xml.fulfillmentToken.resourceItemInfo[0].metadata[0];
  const title = metadata["dc:title"][0]._;
  const author = metadata["dc:creator"][0]._;
  const outputFile = `${title} - ${author}.acsm`;
  return outputFile;
}
