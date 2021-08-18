// Source https://blog.tericcabrel.com/upload-file-to-google-drive-with-nodejs/

const fs = require("fs");
const { google } = require("googleapis");

/**
 * Browse the link below to see the complete object returned for folder/file creation and search
 *
 * @link https://developers.google.com/drive/api/v3/reference/files#resource
 */

class GoogleDriveService {
  driveClient;

  constructor(clientId, clientSecret, redirectUri, refreshToken) {
    this.driveClient = this.createDriveClient(
      clientId,
      clientSecret,
      redirectUri,
      refreshToken
    );
  }

  createDriveClient(clientId, clientSecret, redirectUri, refreshToken) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken });

    return google.drive({
      version: "v3",
      auth: client,
    });
  }

  createFolder(folderName) {
    return this.driveClient.files.create({
      resource: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id, name",
    });
  }

  getAllFolders() {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder'`,
          spaces: "drive",
          fields: "files(id)",
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.data.files);
        }
      );
    });
  }

  saveFile(fileName, filePath, fileMimeType, folderId) {
    return this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    });
  }

  async testCredentials(folderId) {
    const folders = await this.getAllFolders();
    const hasFolderId = folders.some((folder) => folder.id === folderId);
    if (!hasFolderId) {
      throw new Error("Given Drive folder ID cannot be accessed or found.");
    }
  }
}

module.exports = {
  GoogleDriveService,
};
