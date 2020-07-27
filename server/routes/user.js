const express = require("express");
const router = express.Router();

const { User } = require("../models/models");
const { Post } = require("../models/models");

const requireLogin = require("../middlewares/requireLogin");

router.get("/user/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      Post.find({ user: req.params.userId })
        .populate("user", "_id name followers following")
        .exec((error, posts) => {
          if (error) {
            return res.status(404).json({ error });
          }
          return res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/user/:userId/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.params.userId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.json({ error: err });
        });
    }
  );
});

router.put("/user/:userId/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.params.userId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.json({ error: err });
        });
    }
  );
});

router.put("/user/update/image", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { image: req.body.image } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.json({error:err});
      }
      res.json(result);
    }
  );
});

module.exports = router;
