const path = require("path");
const filePath = require("../codeFolders/fileCreatingPath");

exports.getCommands = (fileUUID, lang) => {
  const fileCommands = {
    c: ["g++", "-o", "filename.exe", "filename.c"],
    cpp: ["g++", "-o", "filename.exe", "filename.cpp"],
    py: ["python", "filename.py"],
    java: [
      ["javac", "CodingIDE.java"],
      ["java", "-cp", "dirPath", "CodingIDE"],
    ],
  };

  const commandExec = fileCommands[lang];
  if (lang === "c" || lang === "cpp") {
    commandExec[2] = path.join(
      filePath.fileCreatingPath(lang),
      `${fileUUID}.exe`
    );
    commandExec[3] = path.join(
      filePath.fileCreatingPath(lang),
      `${fileUUID}.${lang}`
    );
  }

  if (lang === "py") {
    commandExec[1] = path.join(
      filePath.fileCreatingPath(lang),
      `${fileUUID}.${lang}`
    );
  }

  if (lang === "java") {
    commandExec[0][1] = path.join(
      filePath.fileCreatingPath(lang),
      `${fileUUID}`,
      `CodingIDE.java`
    );

    commandExec[1][2] = path.join(
      filePath.fileCreatingPath(lang),
      `${fileUUID}`
    );
  }

  return commandExec;
};
