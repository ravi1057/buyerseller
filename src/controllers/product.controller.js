const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Product = require("../models/product.model");
// const User = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");

const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock, images } = req.body;
  const user = req.user;
  if (user.role !== "seller") {
    throw new ApiError(403, "Only Sellers can create the Product");
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

const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  if (!products) {
    throw new ApiError(400, "Products not found");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, products, "All Products are Fetched"));
});

const updateProductDetails = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price } = req.body;
  if (!productId) {
    throw new ApiError(400, "Product not found");
  }
  if (!name || !description || !price) {
    throw ApiError(400, "All Fields are Required");
  } else {
    const product = await Product.findById(productId);
    console.log("product===>", product);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    if (product.seller?.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You don't have permission to update this product");
    }
    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          name,
          description,
          price,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!updateProduct) {
      throw new ApiError(
        500,
        "Something went wrong while updating the product"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updateProduct,
          "Product Details Updated successfully"
        )
      );
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product not found");
  }

  //find the product
  const product = await Product.findById({
    _id: productId,
  });

  if (product.seller?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to delete this product");
  }

  const deleteProduct = await Product.findByIdAndDelete(product);

  if (!deleteProduct) {
    throw new ApiError(500, "Something went wrog while deleting product");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deleteProduct, "Product Deleted Successfully"));
});

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProductDetails,
  deleteProduct,
};
