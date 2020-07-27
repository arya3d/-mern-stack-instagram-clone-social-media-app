import React, { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";

export const disableButton = (state, setState) => {
  setState(!state);
  setTimeout(() => {
    setState(false);
  }, 800);
};

export const BackDropLoader = ({loading}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    if(loading===true){
      handleOpen();
    }else {
      handleClose();
    }
  }, [loading]);

  return (
    <div>
      <Backdrop className="back-drop-loader" open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
