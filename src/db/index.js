const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\n Mongodb Connected !! HoST:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongo DB Connection Failed", error);
    process.exit(1);
  }
};

module.exports = connectDB