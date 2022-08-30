const { codeManager } = require("../utils/codeManager");

exports.renderIde = (req, res, next) => {
  res.status(200).render("index");
};

exports.compileCode = async (req, res, next) => {
  try {
    // console.log("RECEIVED THE REQUEST");
    // console.log(req.body);

    if (!req.body.code) {
      throw Error("No Code found!!!");
    }

    const inputs = req.body.input ? JSON.parse(req.body.input) : undefined;
    const codeOutput = await codeManager(
      req.body.code,
      req.body.language,
      inputs
    );

    res.status(200).json({
      status: "success",
      output: codeOutput,
    });
  } catch (err) {
    console.log("☠️ Received an error...");
    console.log(err.message);
    res.status(400).json({
      status: "fail",
      output: err.message,
    });
  }
};
