const path = require("path");

exports.fileCreatingPath = (lang) => {
  return path.join(__dirname, `${lang}`);
};

exports.fileDeletingPath = (lang, fileUUID) => {
  return new Promise(function (resolve, reject) {
    const delFiles = [];

    // Deleting the files of unique id
    if (lang === "c" || lang === "cpp" || lang === "js" || lang === "py") {
      if (lang === "c" || lang === "cpp") {
        delFiles.push(path.join(__dirname, `${lang}`, `${fileUUID}.exe`));
      }
      delFiles.push(path.join(__dirname, `${lang}`, `${fileUUID}.${lang}`));
    }

    // Deleting the directory of unique id
    if (lang === "java") {
      delFiles.push(path.join(__dirname, `${lang}`, `${fileUUID}`));
    }

    resolve(delFiles);
  });
};
