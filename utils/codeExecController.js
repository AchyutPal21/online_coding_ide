const command = require("./commands");
const { execCode } = require("./execCode");

exports.codeExecController = (fileUUID, lang, input) => {
  return new Promise(function (resolve, reject) {
    const codeCommand = command.getCommands(fileUUID, lang);
    const javaCmds = lang === "java" ? codeCommand[0] : "";

    // fileType is py because if there is some input for py we will use it, as py file need not to be compiled at first step, we can directly execute it. And can get the response as a promise, which is catch at the else block.

    // if and else-if are for c, cpp, java as they need to be to be build first and then need to be executed
    execCode(javaCmds || codeCommand, false, input, "py")
      .then((data) => {
        if (lang === "c" || lang === "cpp") {
          return execCode(codeCommand[2], true, input, "ccpp");
        } else if (lang === "java") {
          return execCode(codeCommand[1], true, input, "java");
        } else {
          resolve(data);
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
