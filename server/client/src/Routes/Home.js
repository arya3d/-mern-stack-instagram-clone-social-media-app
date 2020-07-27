import React, { useState, useEffect } from "react";
import PostCard from "../Components/PostCard/PostCard";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);

  let location = useLocation();

  const getPosts = async () => {
    try {
      const postsRes =
        location.pathname === "/followed"
          ? await axios({
              method: "get",
              url: "/posts/followed",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
              },
            })
          : await axios.get("/posts");
      setPosts(postsRes.data.posts);
      console.log(postsRes.data.posts);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <div className="home-card-container">
        {posts &&
          posts.map((post) => {
            return (
              <div key={post._id} className="home-card-wrapper">
                <PostCard post={post} getPosts={() => getPosts()} />
              </div>
            );
          })}
      </div>
    </>
  );
}
