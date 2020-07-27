import React from "react";

import { Link } from "react-router-dom";

import { Button, IconButton } from "@material-ui/core";

import AccountCircle from "@material-ui/icons/AccountCircle";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

export const NavLinks = ({ userState }) => {
  return (
    <div>
      {userState ? (
        <>
          <Link
            to={`/profile/${userState._id}`}
            className="link navbar-account-icon"
          >
            <IconButton>
              <AccountCircle />
            </IconButton>
          </Link>
          <Link to="/upload" className="link nav-btn ">
            <Button
              variant="contained"
              className="primary"
              startIcon={<CloudUploadIcon />}
            >
              Upload
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className="link nav-btn ">
            <Button color="inherit">Login</Button>
          </Link>
          <Link to="/signup" className="link nav-btn ">
            <Button variant="contained" className="primary">
              Signup
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};
