const dotenv = require("dotenv");

const jwt = require("jsonwebtoken");

const { User } = require("../models/models");

dotenv.config({ path: "../config/config.env" });

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(206).json({ error:"You must login" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(206).json({ error: "You must login" });
    }

    const { _id } = payload;
    User.findById(_id)
      .then((userData) => {
        req.user = userData;
        next();
      })
      .catch((err) => {
        return res.json({ error: `Something went wrong : ${err}` });
      });
  });
};
