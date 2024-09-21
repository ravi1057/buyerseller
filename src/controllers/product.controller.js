const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Product = require("../models/product.model");
const ApiResponse = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");

const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock, images } = req.body;
  const user = req.user;
  if (user.role !== "seller") {
    throw new ApiError(403, "Only Sellers can create the Prdouct");
  }
  if (!name || !description || !price || !category || !stock || !images) {
    throw new ApiError(400, "All Fields are Require");
  }

  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    throw new ApiError(404, "Product with this name already exists");
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images,
    seller: req.user._id,
  });

  const createdProduct = await Product.findById(product._id);
  if (!createdProduct) {
    throw new ApiError(500, "Something went wrong while cretating the product");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdProduct, "Product Created Successfully"));
});

const getProductById = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product not found");
  }

  const product = await Product.findById({ _id: productId });
  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product Details Fetched Successfully")
    );
});

module.exports = {
  createProduct,
  getProductById,
};
