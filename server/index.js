const express = require("express");
const { dbConnect } = require("./db/db.connect");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const corsOption = {
  origin: "*",
  credentials: true,
};

require("dotenv").config();
dbConnect();

app.use(express.json());
app.use(cors(corsOption));
app.use(morgan("tiny"));

app.use("/auth", require("./routes/signup"));
app.use("/auth/projects", require("./routes/project"));
app.use("/auth/teams", require("./routes/team"));
app.use("/auth/tags", require("./routes/tag"));
app.use("/auth/tasks", require("./routes/task"));
app.use("/auth/report", require("./routes/report"));

app.use((err, _req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({ message, stack: err.stack });
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to expressjs new library");
});
app.get("/photos", (req, res) => {
  res.send("Welcome to photos libray");
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
