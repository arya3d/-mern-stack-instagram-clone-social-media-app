import React, { useState, useEffect } from "react";

import axios from "axios";

import { useParams } from "react-router-dom";

import PostCard from "../Components/PostCard/PostCard";

const Post = () => {
  const { postId } = useParams();

  const [post, setPost] = useState();

  const getPost = async () => {
    try {
      const postRes = await axios.get(`/posts/${postId}`);
      setPost(postRes.data.post[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPost();
  }, []);
  return <>
  <div className="post-page-container">
      {post && <PostCard postId={postId} post={post} />}
  </div>
  
  </>;
};

export default Post;
