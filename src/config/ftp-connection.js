"use strict";
const ftp = require("basic-ftp");

async function CreateDirectoryToFTP(createVideoFolder) {
  const client = new ftp.Client();
  try {
    await client.access({
      host: "92.42.109.45",
      user: "fileupload@hithot.club",
      password: "ydRp@JPaSs5N",
      secure: false,
    });
    // upload the local file located in localFile
    await client.cd("API");
    await client.ensureDir(createVideoFolder);
  } catch (err) {
    console.log(err);
  }
  client.close();
}

async function uploadFileToFTP(localFile, RemoteFile) {
  const client = new ftp.Client();
  try {
    await client.access({
      host: "92.42.109.45",
      user: "fileupload@hithot.club",
      password: "ydRp@JPaSs5N",
      secure: false,
    });
    await client.cd("API");
    await client.uploadFrom(localFile, RemoteFile);
  } catch (err) {
    console.log(err);
  }
  client.close();
}

async function downloadFileFromFTP(localFile, RemoteFile) {
  const client = new ftp.Client();
  try {
    await client.access({
      host: "92.42.109.45",
      user: "fileupload@hithot.club",
      password: "ydRp@JPaSs5N",
      secure: false,
    });
    await client.cd("API");
    await client.downloadTo(localFile, RemoteFile);
  } catch (err) {
    console.log(err);
  }
  client.close();
}

module.exports = {
  uploadFileToFTP,
  CreateDirectoryToFTP,
  downloadFileFromFTP,
};
