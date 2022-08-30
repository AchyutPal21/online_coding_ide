const { spawn } = require("child_process");

/**
 *
 * @param {String[]} buildCommand
 * @returns
 */
exports.execCode = (buildCommand, build = false, inputs, codeType) => {
  return new Promise(function (resolve, reject) {
    let shell;
    let output = "";
    let checkCounter = false;

    if (build) {
      if (buildCommand[0] === "java") {
        shell = spawn(buildCommand[0], buildCommand.slice(1));
      } else {
        shell = spawn(buildCommand);
      }
    }

    if (!build) {
      shell = spawn(buildCommand[0], buildCommand.slice(1));
    }

    // For the infinite loop
    let killShell = setTimeout(() => {
      console.log("🔥KILLED🔥");
      shell.kill();
    }, 15000);

    // At the time of build we don't get any data so this will not fired
    let count = 0;

    ////////////////////////////////////////////////////////////////////////
    // Giving inputs to the STDIN process
    if (inputs && inputs.length > 0 && (build === true || codeType === "py")) {
      inputs.forEach((input) => {
        shell.stdin.write(`${input}`, (error) => {
          if (error) console.log(error);
        });
      });
      shell.stdin.end();
    }
    /////////////////////////////////////////////////////////////////////////

    shell.stdout.on("data", (data = "default") => {
      output += `${data.toString()}\n`;
      if (checkCounter) {
        count++;
        if (count === 100) {
          shell.kill();
        }
      }
    });

    shell.stderr.on("data", (data) => {
      output += `${data.toString()}\n`;
      // console.log("🐍🐍🐍");
    });

    shell.on("error", (err) => {
      output += err.message;
      // console.log("☠️☠️☠️");
    });

    // When there is not data we need this to get fired for the build files only
    shell.on("exit", (code, signal) => {
      clearTimeout(killShell);
      if (code || signal) {
        if (shell.killed) {
          output =
            "CodingIDE - Execution Time Exceeded. Please Check You Code!!!";
          // console.log("Break");
        }
        reject(output);
      } else {
        resolve(output);
      }
    });

    shell.on("close", (code, signal) => {
      if (code || signal) {
        // console.log("Error while CLOSE");
      } else {
        // console.log("Shell Closed");
      }
    });
  });
};
