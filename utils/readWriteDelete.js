const path = require("path");
const fs = require("fs");

const rimraf = require("rimraf");

const filePath = require("../codeFolders/fileCreatingPath");

// Creating program file for the incoming code
exports.createFile = (code, lang, fileUUID) => {
  return new Promise(function (resolve, reject) {
    // Getting path for creating code file
    const fileName = path.join(
      filePath.fileCreatingPath(lang),
      lang === "java" ? `${fileUUID}` : "",
      lang === "java" ? `CodingIDE.java` : `${fileUUID}.${lang}`
    );

    // Write code file
    fs.writeFile(fileName, code, (err) => {
      if (err) {
        reject(err);
      }
      resolve("file created");
    });
  });
};

exports.deleteFile = (lang, fileUUID) => {
  return new Promise(function (resolve, reject) {
    filePath
      .fileDeletingPath(lang, fileUUID)
      .then((data) => {
        data.forEach((pathValue) => {
          fs.unlink(pathValue, (err) => {
            if (err) {
            } else {
            }
          });
        });
        resolve("💥File's Deleted");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.createDir = (id, lang) => {
  return new Promise(function (resolve, reject) {
    const dirName = path.join(filePath.fileCreatingPath(lang), `${id}`);
    fs.mkdir(dirName, (err) => {
      if (err) {
        reject(err);
      }
      resolve("Dir Created");
    });
  });
};

exports.deleteDir = (lang, fileUUID) => {
  return new Promise(function (resolve, reject) {
    filePath
      .fileDeletingPath(lang, fileUUID)
      .then((data) => {
        data.forEach((pathValue) => {
          rimraf(pathValue, (err) => {
            if (err) {
            }
          });
        });
        resolve("💥Directory Deleted");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

fs.rem;
