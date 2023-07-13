const express = require("express");
const generateToken = require("./tokenGenerateRoutes");
const planTask = require("./productRoutes");

const router = express.Router();

router.use("/v1", planTask, generateToken);

module.exports = router;
