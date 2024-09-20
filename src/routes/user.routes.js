const express = require("express");

const {
  registerUser,
  loginUser,
  currentUser,
  getUserById,
} = require("../controllers/user.controller");
const verifyJwT = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/current-user").post(verifyJwT, currentUser);

router.route("/:userId").get(getUserById);

module.exports = router;
