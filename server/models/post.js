const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
    userImage: {
      type: String,
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: String,
        user: {
          type: ObjectId,
          ref: "User",
        },
        // createdAt: {
        //   type: String,
        // },
      },
    ],
  },
  { collection: "posts" }
);

mongoose.model("Post", postSchema);
