const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const S3 = require("aws-sdk/clients/s3");
const mime = require("mime-types");

const accessKeyId = process.env.AWS_IAM_USER_KEY;
const secretAccessKey = process.env.AWS_IAM_USER_SECRET;

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
});

async function uploadToS3(optimizeResultFile, filename) {
  let mimeType = mime.lookup(filename);
  if (mimeType == "audio/x-aac") {
    mimeType = "audio/aac";
  }
  let uploadParams = {
    Bucket: "hithotaws",
    Body: await fsPromises.readFile(path.resolve(optimizeResultFile)),
    Key: "API/" + filename,
    ACL: "public-read",
    ContentType: mimeType,
  };

  try {
    const stored = await s3.upload(uploadParams).promise();
    // console.log(stored);
  } catch (err) {
    // console.log(err);
  }
}

async function getFromS3(RemoteFile, localFile) {
  return await new Promise((resolve, reject) => {
    const writerStream = fs.createWriteStream(RemoteFile);
    let uploadParams = {
      Bucket: "hithotaws",
      Key: "API/" + localFile,
    };
    const s3Stream = s3.getObject(uploadParams).createReadStream();
    s3Stream
      .pipe(writerStream)
      .on("error", function (err) {
        reject(err);
      })
      .on("close", function () {
        resolve("OK");
      });
  });
}

async function getListS3() {
  return await new Promise((resolve, reject) => {
    let uploadParams = {
      Bucket: "hithotaws",
      Prefix: "API/uploadSound/upload",
    };
    s3.listObjectsV2(uploadParams, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function checkFileExistS3(filename) {
  let uploadParams = {
    Bucket: "hithotaws",
    Key: "API/" + filename,
  };
  try {
    await s3.headObject(uploadParams).promise();
    return true;
  } catch (err) {
    return false;
  }
}

async function deleteFileFroms3(filename) {
  let uploadParams = {
    Bucket: "hithotaws",
    Key: "API/" + filename,
  };
  try {
    await s3.deleteObject(uploadParams).promise();
    return true;
  } catch (err) {
    return false;
  }
}
module.exports = {
  uploadToS3,
  getFromS3,
  checkFileExistS3,
  deleteFileFroms3,
  getListS3,
};
