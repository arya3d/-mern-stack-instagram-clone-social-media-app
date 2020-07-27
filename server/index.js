const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config({ path: "./config/.env" });

connectDB();

// Mongoose models
require("./models/user");
require("./models/post");

app.use(express.json());

// user authentication routes
app.use(require("./routes/auth"));
// post routes
app.use(require("./routes/post"));
// user profile routes
app.use(require("./routes/user"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
