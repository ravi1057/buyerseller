const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Import Routes

const userRouter = require("./routes/user.routes");
const productRouter = require("./routes/product.routes");
//routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

module.exports = { app };
