import React, { useEffect, useState, useContext } from "react";

import { UserContext } from "../../Global/Context";

import { useHistory } from "react-router-dom";

import axios from "axios";

import { TextField, Typography, Button, IconButton } from "@material-ui/core";

import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import SendIcon from "@material-ui/icons/Send";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { standardNotification } from "../../Utils/Notifications";
import { BackDropLoader } from "../../Utils/UserExp";

import { API_URL } from "../../config";

toast.configure();

export default function Upload() {
  const history = useHistory();

  const { userState } = useContext(UserContext);

  if (!userState) {
    history.push("/");
  }

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState(" ");

  const postData = async () => {
    setLoading(true);
    // axios has problem with headers if we send a request like : axios.post(url , {config});
    const postRes = await axios({
      method: "post",
      url: "/posts/user/upload",
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
      data: {
        title,
        caption,
        createdAt: new Date().toISOString(),
        image: imageUrl,
      },
    });

    // User with the same email existence validation
    if (postRes.data.error) {
      setLoading(false);
      standardNotification(postRes.data.error, "error");
      return;
    }

    setLoading(false);
    standardNotification("Post created successfully ", "info");
    history.push("/");
  };

  useEffect(() => {
    if (imageUrl) {
      postData();
    }
  }, [imageUrl]);

  const createPost = async () => {
    try {
      if (!title) {
        standardNotification("You should write the title", "warning");
        return;
      } else if (!image) {
        standardNotification("You should choose an image", "warning");
        return;
      }

      const imageData = new FormData();

      imageData.append("file", image);
      imageData.append("upload_preset", "linx-cloud");
      imageData.append("cloud_name", "ariasalehi");

      setLoading(true);

      const imageRes = await axios.post(API_URL, imageData);

      setImageUrl(imageRes.data.url);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    window.document
      .getElementsByTagName("textarea")[0]
      .setAttribute("maxlength", "1200");
  }, []);
  return (
    <div className="upload-container">
      {loading && <BackDropLoader loading={loading} />}
      <Typography component="h1" variant="h5" className="upload-title">
        Create a post
      </Typography>
      <TextField
        className="upload-title-input"
        label="Title"
        placeholder="Add the title of your post"
        fullWidth
        margin="normal"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="upload-upload-image">
        <input
          accept="image/*"
          className="upload-input"
          id="contained-button-file"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            className="primary"
            component="span"
            startIcon={<AddAPhotoIcon />}
          >
            Upload Image
          </Button>
        </label>
        <input
          accept="image/*"
          className="upload-input"
          id="icon-button-file"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
      </div>
      <div className="upload-description-container">
        <TextField
          id="filled-textarea"
          label="Caption"
          placeholder="Write the description of your post"
          multiline
          variant="filled"
          className="upload-description-input"
          rows={4}
          rowsMax={11}
          fullWidth={true}
          classes
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      <Button
        variant="contained"
        className="primary"
        endIcon={<SendIcon />}
        fullWidth={true}
        onClick={() => createPost()}
      >
        Post
      </Button>
    </div>
  );
}
