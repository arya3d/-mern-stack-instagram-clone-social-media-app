import React, { useState, useContext, useRef } from "react";

import { Link, useHistory } from "react-router-dom";

import { UserContext } from "../../Global/Context";

import axios from "axios";

import OptionsMenu from "./Menu";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
  InputLabel,
  Input,
  InputAdornment,
  FormControl,
} from "@material-ui/core";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@material-ui/icons/Send";
import ProfileAvatar from "../Profile/ProfileAvatar";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import { standardNotification } from "../../Utils/Notifications";
import { disableButton } from "../../Utils/UserExp";
import { timeAgo } from "../../Utils/Time";

export default function PostCard({ getPosts, post, postId }) {
  const history = useHistory();

  const { userState } = useContext(UserContext);

  const [postData, setPostData] = useState(post);

  const [liked, setLiked] = useState(
    userState ? postData.likes.includes(userState._id) : false
  );

  const [commentsExpanded, setCommentsExpanded] = useState(
    postId ? true : false
  );

  const [commentInputExpanded, setCommentInputExpanded] = useState(false);

  const [comment, setComment] = useState("");

  const [commentButtonDisabled, setCommentButtonDisabled] = useState(false);

  const sendCommentBtn = useRef(null);

  const handleExpandCommentsClick = () => {
    setCommentsExpanded(!commentsExpanded);
  };

  const handleCommentInputExpanding = () => {
    setCommentInputExpanded(!commentInputExpanded);
  };

  const updatePost = async (postId) => {
    const updatedPost = await axios.get(`/posts/${postId}`).then((res) => {
      console.log(res.data.post[0]);
      return res.data.post[0];
    });
    setPostData(updatedPost);
  };
  const likePost = async (postId) => {
    setLiked(!liked);
    await axios({
      method: "put",
      url: `/posts/${postId}/like`,
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
      data: {
        postId,
      },
    }).then(() => {
      updatePost(postId);
    });
  };
  const unlikePost = async (postId) => {
    setLiked(!liked);
    await axios({
      method: "put",
      url: `/posts/${postId}/unlike`,
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
      data: {
        postId,
      },
    }).then(() => {
      updatePost(postId);
    });
  };
  const commentPost = async (postId, text) => {
    if (text === "") {
      standardNotification("Fill out the comment field", "warning");
      return;
    }
    await axios({
      method: "put",
      url: `/posts/${postId}/comment`,
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
      data: {
        postId,
        text,
      },
    }).then(() => {
      standardNotification("Commented successfully", "info");
    });

    updatePost(postId);
    setComment("");
    setCommentsExpanded(true);
    setCommentInputExpanded(false);
  };
  const deletePost = async (postId) => {
    await axios({
      method: "delete",
      url: `/posts/${postId}/delete`,
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    });
    getPosts();
  };

  const copyShareLink = (value) => {
    var tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  };

  const noAccount = () => {
    history.push("/signup");
    standardNotification("You have to signup", "warning");
  };

  return (
    <Card className="post-card-container">
      <CardHeader
        avatar={
          <Link to={`/profile/${postData.user._id}`} className="link">
            {postData.user.image === "no-image" ? (
              <ProfileAvatar
                name={post.user.name}
                className="post-card-profile-avatar"
              />
            ) : (
              <Avatar aria-label="recipe" className="post-card-profile-avatar">
                <img
                  src={postData.user.image}
                  alt="profile"
                  className="post-card-profile-image"
                />
              </Avatar>
            )}
          </Link>
        }
        action={
          userState && (
            <OptionsMenu
              deletePost={deletePost}
              postId={post._id}
              deleteOption={userState._id === post.user._id ? true : false}
            />
          )
        }
        title={
          <Link to={`/profile/${postData.user._id}`} className="link">
            {post.user.name}
          </Link>
        }
        subheader={timeAgo(post.createdAt)}
      />
      <Link to={!postId && `/post/${post._id}`}>
        <div className="post-card-media-container">
          <CardMedia
            className="post-card-media"
            image={post.image}
            title={post.title}
          />
        </div>
      </Link>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          className="post-card-like-icon"
          onClick={() =>
            userState
              ? liked
                ? unlikePost(post._id)
                : likePost(post._id)
              : noAccount()
          }
        >
          <FavoriteBorderOutlinedIcon className="post-card-like-icon-inactive" />
          <FavoriteIcon
            className={
              userState
                ? `post-card-like-icon-active ${
                    liked && "post-card-like-icon-liked"
                  }`
                : "post-card-like-icon-active"
            }
          />
        </IconButton>
        <IconButton
          onClick={() => {
            userState ? handleCommentInputExpanding() : noAccount();
          }}
        >
          <CommentOutlinedIcon />
        </IconButton>
        <IconButton
          aria-label="share"
          onClick={() => {
            var getUrl = window.location;
            var baseUrl =
              getUrl.protocol +
              "//" +
              getUrl.host +
              "/" +
              getUrl.pathname.split("/")[1];
            copyShareLink(`${baseUrl}post/${postData._id}`);
            standardNotification("Link copied to clipboard", "info");
          }}
        >
          <ShareIcon />
        </IconButton>
        <Button
          disabled={postData.comments.length !== 0 ? false : true}
          className={`post-card-comments-btn ${
            postData.comments.length === 0 &&
            "post-card-expand-comments-disabled"
          }`}
          onClick={() => {
            handleExpandCommentsClick();
          }}
          aria-expanded={commentsExpanded}
          aria-label="show more"
          color="inherit"
          endIcon={
            <ExpandMoreIcon
              className={`post-card-expand-arrow ${
                commentsExpanded && "post-card-expand-open"
              }`}
            />
          }
        >
          {`${
            postData && postData.comments.length > 0
              ? postData.comments.length
              : "no"
          } comments`}
        </Button>
      </CardActions>
      <Typography
        variant="body2"
        color="textSecondary"
        className="post-card-likes-number"
      >
        {postData.likes.length} likes
      </Typography>
      <CardContent className="post-card-content">
        <Typography
          variant="h4"
          color="inherit"
          component="p"
          className="post-card-title"
        >
          {postData.title}
        </Typography>
        <Typography component="p" className="post-card-caption">
          {postData.caption}
        </Typography>
      </CardContent>

      <Collapse in={commentInputExpanded}>
        <div className="post-card-comment-input-container">
          <FormControl id="post-card-comment-input">
            <InputLabel className="post-card-comment-input-label">
              Comment
            </InputLabel>
            <Input
              required
              className="post-card-comment-input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => {
                e.key === "Enter" && sendCommentBtn.current.click();
              }}
              placeholder="Add your opinion about this post"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    ref={sendCommentBtn}
                    type="submit"
                    className="post-card-comment-btn"
                    disabled={commentButtonDisabled}
                    onClick={() => {
                      commentPost(post._id, comment);
                      disableButton(
                        commentButtonDisabled,
                        setCommentButtonDisabled
                      );
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
      </Collapse>

      <Collapse in={commentsExpanded} timeout={500} unmountOnExit>
        <CardContent>
          {postData.comments.map((comment) => {
            return (
              <div className="post-card-comments-container">
                <div className="post-card-comments-wrapper">
                  <div className="post-card-comments-header">
                    <Link
                      to={`/profile/${comment.user._id}`}
                      className="link post-card-comments-link"
                    >
                      {comment.user.image === "no-image" ? (
                        <ProfileAvatar
                          name={post.user.name}
                          className="post-card-profile-avatar"
                        />
                      ) : (
                        <Avatar
                          aria-label="recipe"
                          className="post-card-profile-avatar"
                        >
                          <img
                            src={comment.user.image}
                            alt="profile"
                            className="post-card-profile-image"
                          />
                        </Avatar>
                      )}

                      <Typography className="post-card-comments-user-title">
                        {comment.user.name}
                      </Typography>
                    </Link>
                  </div>
                  <div className="post-card-comments-caption-container">
                    <Typography
                      paragraph
                      className="post-card-comments-comment"
                    >
                      {comment.text}
                    </Typography>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Collapse>
    </Card>
  );
}
