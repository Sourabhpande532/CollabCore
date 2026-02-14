const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "myWorkasanaDatabase",
    });
    if (connection) {
      console.log("DB Connected");
    }
  } catch (error) {
    console.error("DB Error:", error.message);
    console.log("DB Connection Failed:", error.message);
  }
};
module.exports = { dbConnect };
