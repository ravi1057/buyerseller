const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");


const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating accessToken and refreshTOken"
    );
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    throw new ApiError(400, "All Fields are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ username, email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username and Email is Required");
  }

  const user = await User.findOne({ $or: [{ username, email }] });
  
  if (!user) {
    throw new ApiError(401, "User doesnot exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In Successfully"
      )
    );
});

const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Fetched Successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log("req params", req.params);

  if (!userId) {
    throw ApiError(404, "User not found");
  }

  const user = await User.findById({ _id: userId });


  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Details Fetched Successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getUserById,
};
