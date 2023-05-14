const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to database");
  } catch (error) {
    console.log("Db Connect Failed",error);
    process.exit(1);
  }
};

module.exports = { connectDb };
