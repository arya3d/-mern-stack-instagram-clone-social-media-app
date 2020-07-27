const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");

const jwt = require("jsonwebtoken");

const { User } = require("../models/models");

const bcrypt = require("bcryptjs");

dotenv.config({ path: "./config/config.env" });

// signup route
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        return res
          .status(206)
          .json({ error: "User already exists with that email" });
      }
      User.findOne({ name }).then((existingName) => {
        if (existingName) {
          return res
            .status(206)
            .json({ error: "User already exists with that username" });
        }
      });

      bcrypt.hash(password, 15).then((hashedPassword) => {
        const user = new User({
          email,
          name,
          password: hashedPassword,
        });

        user
          .save()
          .then(() => {
            return res.status(201).json();
          })
          .catch((err) => {
            return res.status(400).json({ error: err });
          });
      });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
});

// login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((existingUser) => {
    if (!existingUser) {
      return res.status(206).json({ error: "Wrong user credentials" });
    }

    bcrypt
      .compare(password, existingUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign(
            { _id: existingUser._id },
            process.env.JWT_SECRET
          );
          const { _id, name, email, followers, following } = existingUser;
          return res
            .status(201)
            .json({ token, user: { _id, name, email, followers, following } });
        }
        return res
          .status(206)
          .json({ error: "We cant find a user with that info" });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
