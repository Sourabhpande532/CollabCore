const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGO_URL;
const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(url);
    if (connection) {
      console.log("DB Connected");
    }
  } catch (error) {
    console.error("DB Error:", error.message);
    console.log("DB Connection Failed:", error.message);
  }
};
module.exports = { dbConnect };
