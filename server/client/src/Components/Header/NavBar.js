import React, { useState, useContext } from "react";

import { UserContext } from "../../Global/Context";

import { Link } from "react-router-dom";

import { NavLinks } from "./NavLinks";

// material ui components
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";

// icons
import MenuIcon from "@material-ui/icons/Menu";
import Hamburger from "./Hamburger";

export default function NavBar() {
  const { userState, dispatchUser } = useContext(UserContext);

  const [anchor, setAnchor] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setAnchor(open);
  };

  return (
    <div className="app-bar-container">
      <AppBar position="static" className="app-bar">
        <Toolbar className="app-bar-toolbar">
          <IconButton
            edge="start"
            className="menu-btn"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Hamburger
            toggleDrawer={toggleDrawer}
            userState={userState}
            dispatchUser={dispatchUser}
            anchor={anchor}
          />
          <Typography variant="h6" noWrap>
            <Link to="/" className="link logo">
              Linx
            </Link>
          </Typography>
          <div className="app-bar-container" />
          <NavLinks userState={userState} />
        </Toolbar>
      </AppBar>
    </div>
  );
}
