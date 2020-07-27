const express = require("express");
const router = express.Router();

const { Post } = require("../models/models");
const { User } = require("../models/models");

const requireLogin = require("../middlewares/requireLogin");

// getting all the posts
router.get("/posts", (req, res) => {
  Post.find()
    .populate("user", "_id name image")
    .populate("comments.user", "_id name image")
    .then((posts) => {
      return res.status(200).json({ posts });
    })
    .catch((err) => {
      return res.json({ error: `Something went wrong : ${err}` });
    });
});

// getting all the posts from subscribed users
router.get("/posts/followed", requireLogin, (req, res) => {
  Post.find({ user: { $in: req.user.following } })
    .populate("user", "_id name image")
    .populate("comments.user", "_id name")
    .then((posts) => {
      return res.status(200).json({ posts });
    })
    .catch((err) => {
      return res.json({ error: `Something went wrong : ${err}` });
    });
});

// getting a post by id
router.get("/posts/:postId", (req, res) => {
  Post.find({ _id: req.params.postId })
    .populate("user", "name image")
    .populate("comments.user", "name _id image")
    .then((post) => {
      return res.status(200).json({ post });
    })
    .catch((err) => {
      return res.json({ error: `Something went wrong : ${err}` });
    });
});

// getting all the posts created by a current user
router.get("/posts/user/posts", requireLogin, (req, res) => {
  Post.find({ user: req.user._id })
    .populate("user", "_id name")
    .then((posts) => {
      return res.status(200).json({ posts });
    })
    .catch((err) => {
      return res.json({ error: `Something went wrong : ${err}` });
    });
});

// getting all the posts created by a user with user id
router.get("/posts/:userId/posts", (req, res) => {
  Post.find({ user: req.params.userId })
    .populate("user", "_id name")
    .then((posts) => {
      return res.status(200).json({ posts });
    })
    .catch((err) => {
      return res.json({ error: `Something went wrong : ${err}` });
    });
});

// posting a post
router.post("/posts/user/upload", requireLogin, (req, res) => {
  const { title, caption, image, createdAt } = req.body;

  req.user.password = undefined;

  const post = new Post({
    title,
    caption,
    image,
    createdAt,
    user: req.user,
  });

  post
    .save()
    .then((result) => {
      return res.status(201).json({ post: result });
    })
    .catch((err) => {
      return res.json({ error: `Something went wrong : ${err}` });
    });
});

// adding like to a post
router.put("/posts/:postId/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(206).json({ error: err });
    }
    return res.json(result);
  });
});
// removing like from a post
router.put("/posts/:postId/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.params.postId, {
    $pull: { likes: req.user._id },
  }).exec((err, result) => {
    if (err) {
      return res.status(206).json({ error: err });
    }
    return res.json(result);
  });
});

// getting the comments of a post by post id
router.get("/posts/:postId/comments", (req, res) => {
  Post.find({ _id: req.params.postId })
    .select("comments")
    .populate("comments.user", "name _id")
    .then((post) => {
      return res.status(200).json({ comments: post[0].comments });
    })
    .catch((err) => {
      return res.json({ error: `Something went wrong : ${err}` });
    });
});

// commenting on a post
router.put("/posts/:postId/comment", requireLogin, (req, res) => {
  req.user.password = undefined;
  const comment = {
    text: req.body.text,
    user: req.user,
  };
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.user", "_id name") //! add user image as well
    .populate("user", "_id name")
    .exec((err, post) => {
      if (err) {
        return res.json({ error: err });
      }
      res.json(post);
    });
});

// deleting a post
router.delete("/posts/:postId/delete", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("user", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.json({ error: err });
      }
      if (post.user._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => console.log(err));
      }
    });
});

module.exports = router;
