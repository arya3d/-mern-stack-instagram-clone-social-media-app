import React from "react";

import { Link } from "react-router-dom";

import {
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircle from "@material-ui/icons/AccountCircle";

const Hamburger = ({ anchor, toggleDrawer, userState, dispatchUser }) => {
  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem className="menulogo-container">
          <IconButton
            edge="start"
            className="menu-btn"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <Link to="/" className="link logo">
              Linx
            </Link>
          </Typography>
        </ListItem>
        <div>
          {userState && (
            <>
              <Link to="/followed" className="link">
                <ListItem button>
                  <div className="list-item-container">
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" className="list-item-text" />
                  </div>
                </ListItem>
              </Link>
              <Link
                to={`/profile/${userState._id}`}
                className="link hamburger-account-icon"
              >
                <ListItem button>
                  <div className="list-item-container">
                    <ListItemIcon>
                      <AccountCircle />
                    </ListItemIcon>
                    <ListItemText
                      primary="Account"
                      className="list-item-text"
                    />
                  </div>
                </ListItem>
              </Link>
            </>
          )}
        </div>
      </List>
      <Divider />
      <List>
        <div>
          {userState && (
            <ListItem
              button
              onClick={() => {
                localStorage.clear();
                dispatchUser({ type: "REMOVE_USER" });
              }}
            >
              <div className="list-item-container">
                <ListItemIcon color="inherit">
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" className="list-item-text" />
              </div>
            </ListItem>
          )}
        </div>
      </List>
    </div>
  );

  return (
    <Drawer anchor="left" open={anchor} onClose={toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
};

export default Hamburger;
