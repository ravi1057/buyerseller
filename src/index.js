const dotenv = require("dotenv");
const connectDB = require("./db/index");
const { app } = require("./app");

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is Listening on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Mongo DB connection failed error !!!`, err);
  });