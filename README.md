# ACSM to Epub converter

Uses [Knock](https://github.com/BentonEdmondson/knock) to convert ACSM files to epub. Afterwards it's uploaded to a Google Drive folder.

Because Knock only has releases for a x86_64 Linux kernel, this will also only work on those platforms.

This automatically downloads the Knock binary.

# Installation

Either through cloning with git or by using npm (the recommended way):

`npm install -g acsm-to-epub`

And `acsmtoepub` will be installed globally to your system path.

# Usage

`acsmtoepub <path/to/acsm>`

# Setup

On first run it will create an empty `settings.json` file in `~/.config/acsmtoepub/` with the following contents

```json
{
  "clientId": "",
  "clientSecret": "",
  "refreshToken": "",
  "redirectUri": "",
  "folderId": ""
}
```

Follow this tutorial to get the credentials : https://blog.tericcabrel.com/upload-file-to-google-drive-with-nodejs/

`folderId` is the id of the Drive folder you want to upload to. You can find this in the URL when browsing from the web interface.
