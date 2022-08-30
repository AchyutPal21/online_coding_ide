const { v4: uuidv4 } = require("uuid");
const {
  createFile,
  deleteFile,
  createDir,
  deleteDir,
} = require("./readWriteDelete");
const { codeExecController } = require("./codeExecController");

async function deletingFiles(language, id) {
  let fileInfo;
  if (language === "java") {
    fileInfo = await deleteDir(language, id);
  } else {
    fileInfo = await deleteFile(language, id);
  }
  return fileInfo;
}

exports.codeManager = async function (code, language, input) {
  const id = uuidv4();
  try {
    if (language === "java") {
      await createDir(id, language);
    }
    await createFile(code, language, id);
    const codeOutput = await codeExecController(id, language, input);
    await deletingFiles(language, id);
    return codeOutput;
  } catch (err) {
    console.log("Error:🔥");
    await deletingFiles(language, id);
    throw new Error(err);
  }
};
