const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkasanaSignupUser",
      },
    ],
  },
  { timestamps: true },
);
module.exports = mongoose.model("Team", teamSchema);
