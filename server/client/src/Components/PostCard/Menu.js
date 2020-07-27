import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { standardNotification } from "../../Utils/Notifications";

const ITEM_HEIGHT = 48;

export default function OptionsMenu({ postId, deleteOption, deletePost }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="post-card-more-icon"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
        className="post-card-options-menu"
      >
        {!deleteOption && (
          <MenuItem
            onClick={() => standardNotification("Post reported", "info")}
          >
            Report
          </MenuItem>
        )}
        {deleteOption && (
          <MenuItem
            onClick={() => {
              handleClose();
              deletePost(postId);
              standardNotification("Post deleted successfully", "info");
            }}
          >
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
