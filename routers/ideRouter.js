const express = require("express");
const ideController = require("./../controllers/ideControllers");
const router = express.Router();

router.route("/").get(ideController.renderIde);

router.route("/:lang").post(ideController.compileCode);

module.exports = router;
