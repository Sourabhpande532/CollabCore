const express = require("express");
const { dbConnect } = require("./db/db.connect");
const app = express();
const cors = require("cors");
const corsOption = {
  origin: "*",
  credential: true,
};

require("dotenv").config();
dbConnect();

app.use(express.json());
app.use(cors(corsOption));

app.use("/auth", require("./routes/signup"));
app.use("/auth/projects", require("./routes/project"));
app.use("/auth/teams", require("./routes/team"));
app.use("/auth/tags", require("./routes/tag"));
app.use("/auth/tasks", require("./routes/task"));
app.use("/auth/report", require("./routes/report"));

app.get("/", (req, res) => {
  res.status(200).send("Welcome to expressjs");
});
app.get("/photos", (req, res) => {
  res.send("Welcome to photos libray");
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
