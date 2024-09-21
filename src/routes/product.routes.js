const express = require("express");

const { createProduct,getProductById } = require("../controllers/product.controller");
const verifyJwT = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/seller/product/new").post(verifyJwT,createProduct);

router.route("/:productId").get(getProductById);

module.exports = router;
