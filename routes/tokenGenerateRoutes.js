const express = require("express");
const { createToken } = require("../controllers/authController");

const router = express.Router();

router.route("/generate-token").post(createToken);

module.exports = router;
