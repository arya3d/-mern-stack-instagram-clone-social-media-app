import React from "react";
import { Avatar } from "@material-ui/core";

const ProfileAvatar = ({ name, className }) => {
  return (
    <>
      <Avatar aria-label="recipe" className={className}>
        {name && name.charAt(0).toUpperCase()}
      </Avatar>
    </>
  );
};

export default ProfileAvatar;
