const fs = require("fs");
var moment = require("moment");
const path = require("path");
let API_path = process.env.media_storage == "s3" ? process.env.S3_path : process.env.API_path;

const utilFunctions = {

    checkFileExist: async function (dt, filePath) {
        let Folder = moment(moment(dt)).format("MMMMYYYY");

        if (process.env.media_storage == "s3") {
        return "UpLoad/UpLoad/" + Folder + "/audio/" + filePath;

        // if (
        //   await checkFileExistS3("UpLoad/UpLoad/" + Folder + "/audio/" + filePath)
        // ) {
        //   return "UpLoad/UpLoad/" + Folder + "/audio/" + filePath;
        // } else if (await checkFileExistS3("UpLoad/upload/audio/" + filePath)) {
        //   return "UpLoad/upload/audio/" + filePath;
        // } else if (
        //   await checkFileExistS3("UpLoad/UpLoad/vidz/audio/" + filePath)
        // ) {
        //   return "UpLoad/UpLoad/vidz/audio/" + filePath;
        // } else {
        //   return "";
        // }
        }

        if (process.env.media_storage == "local") {
        if (
            fs.existsSync(
            path.resolve("UpLoad/UpLoad/" + Folder + "/audio/" + filePath)
            )
        ) {
            return "UpLoad/UpLoad/" + Folder + "/audio/" + filePath;
        } else if (
            fs.existsSync(path.resolve("UpLoad/upload/audio/" + filePath))
        ) {
            return "UpLoad/upload/audio/" + filePath;
        } else if (
            fs.existsSync(path.resolve("UpLoad/UpLoad/vidz/audio/" + filePath))
        ) {
            return "UpLoad/UpLoad/vidz/audio/" + filePath;
        } else {
            return "";
        }
        }
        if (process.env.media_storage == "ftp") {
        return "UpLoad/UpLoad/" + Folder + "/audio/" + filePath;
        }
    },

    checkProfileURL: function (url) {

        if (url != "" && typeof url !== "undefined") {
            
            const regex = new RegExp("googleusercontent");
            let checkImageURL = regex.test(url);
            
            if (checkImageURL == true) {
                return url;
            } else {
                if (utilFunctions.startsWiths(url, "upload")) {
                    return API_path + "UpLoad/" + url;
                } else if (utilFunctions.startsWiths(url, "UpLoad/Vidz")) {
                    return API_path + "UpLoad/" + url;
                } else {
                    return API_path + url;
                }
            }
        } else {
            return "null";
        }
    },

    startsWiths: function (string, startString) {
        let len = startString.length;
        return string.substr(string, len) === startString;
    },

    checkVideoUrl: function (url) {
        if (url != "" && typeof url !== "undefined") {
          if (utilFunctions.startsWiths(url, "upload")) {
            return API_path + "UpLoad/" + url;
          } else if (utilFunctions.startsWiths(url, "UpLoad/Vidz")) {
            return API_path + "UpLoad/" + url;
          } else {
            return API_path + url;
          }
        } else {
          return "null";
        }
    },
};

module.exports = utilFunctions;