const express = require("express");
const { getProduct } = require("../controllers/productController");
const { protect } = require("../controllers/authController");
const router = express.Router();

router.route("/plan-list").post(protect, getProduct);

module.exports = router;
