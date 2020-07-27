import React, { useContext, useState, useEffect } from "react";

import { UserContext } from "../../Global/Context";

import { useParams, Link } from "react-router-dom";

import axios from "axios";

import { useHistory } from "react-router-dom";

import ProfileAvatar from "./ProfileAvatar";

import { Button } from "@material-ui/core";

import { API_URL } from "../../config";

export default function Profile() {
  const { userState, dispatchUser } = useContext(UserContext);

  const { userId } = useParams();

  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("user"));

  const [userPosts, setUserPosts] = useState([]);

  const [userImageUrl, setUserImageUrl] = useState(null);

  const [followed, setFollowed] = useState();
  const [name, setName] = useState();
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();

  const getUserPosts = async () => {
    try {
      // axios has problem with headers if we send a request like : axios.post(url , {config});
      const userPostsRes = await axios({
        method: "get",
        url: `/user/${userId}`,
        headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
      });

      setUserPosts(userPostsRes.data.posts);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserDetails = async () => {
    try {
      // axios has problem with headers if we send a request like : axios.post(url , {config});
      const userPostsRes = await axios({
        method: "get",
        url: `/user/${userId}`,
        headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
      });
      if (user) {
        setFollowed(
          userPostsRes.data.user.followers.includes(user._id) ? true : false
        );
        setFollowers(userPostsRes.data.user.followers.length);
        setFollowing(userPostsRes.data.user.following.length);
        setName(userPostsRes.data.user.name);
        setUserImageUrl(userPostsRes.data.user.image);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadUserImage = async (file) => {
    try {
      const imageData = new FormData();

      imageData.append("file", file);
      imageData.append("upload_preset", "linx-cloud");
      imageData.append("cloud_name", "ariasalehi");

      const imageRes = await axios.post(API_URL, imageData);

      setUserImageUrl(imageRes.data.url);
      await axios({
        method: "put",
        url: "/user/update/image",
        headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
        data: {
          image: imageRes.data.url,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const followUser = async () => {
    setFollowed(!followed);
    const res = await axios({
      method: "put",
      url: `/user/${userId}/follow`,
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    });
    dispatchUser({
      type: "UPDATE-USER",
      payload: { followers: res.data.followers, following: res.data.following },
    });
    localStorage.setItem("user", JSON.stringify(res.data));
    getUserDetails();
  };
  const unfollowUser = async () => {
    setFollowed(!followed);
    const res = await axios({
      method: "put",
      url: `/user/${userId}/unfollow`,
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    });
    dispatchUser({
      type: "UPDATE-USER",
      payload: { followers: res.data.followers, following: res.data.following },
    });
    localStorage.setItem("user", JSON.stringify(res.data));
    getUserDetails();
  };

  useEffect(() => {
    getUserDetails();
    getUserPosts();
  }, [userId, userImageUrl]);
  return (
    <>
      <div className="profile-container">
        <div className="profile-hero-wrapper">
          <div>
            {userState && user._id === userId && (
              <input
                accept="image/*"
                className="profile-update-image-input"
                id="contained-button-file"
                type="file"
                onChange={(e) => {
                  uploadUserImage(e.target.files[0]);
                }}
              />
            )}
            <label htmlFor="contained-button-file">
              {userImageUrl && userImageUrl === "no-image" ? (
                <>
                  <ProfileAvatar name={name} className="profile-picture" />
                </>
              ) : (
                <img
                  src={userImageUrl}
                  alt={userImageUrl && "profile"}
                  className="profile-picture"
                />
              )}
            </label>
          </div>
          <div className="profile-info-wrapper">
            <h1 className="profile-name">{name && name}</h1>
            {userPosts && (
              <div className="profile-details-container">
                <h4>{userPosts.length} posts</h4>
                {followers !== undefined && following !== undefined && (
                  <>
                    <h4>{`${
                      followers !== undefined && followers
                    } followers`}</h4>
                    <h4>{`${
                      following !== undefined && following
                    } following`}</h4>
                  </>
                )}
              </div>
            )}
            {userState && user._id !== userId && (
              <Button
                variant="outlined"
                className={`profile-follow-btn ${!followed && "primary"}`}
                onClick={() => (followed ? unfollowUser() : followUser())}
              >
                {followed ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>
        <div className="profile-gallery-container">
          <div className="profile-gallery">
            {userPosts &&
              userPosts.map((post) => {
                return (
                  <Link to={`/post/${post._id}`}>
                    <img
                      key={post.image}
                      className="profile-gallery-item"
                      src={post.image}
                      alt={post.title}
                    />
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
