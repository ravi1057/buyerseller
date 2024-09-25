const express = require("express");

const {
  createProduct,
  getProductById,
  getAllProducts,
  updateProductDetails,
  deleteProduct,
} = require("../controllers/product.controller");
const verifyJwT = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/seller/product/new").post(verifyJwT, createProduct);
router
  .route("/:productId")
  .get(getProductById)
  .patch(verifyJwT, updateProductDetails)
  .delete(verifyJwT, deleteProduct);
router.route("/").get(getAllProducts);

module.exports = router;
