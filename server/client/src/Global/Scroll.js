import React, { useEffect } from "react";

import Routing from "./Routing";

import SmoothScrollbar from "smooth-scrollbar";
import OverscrollPlugin from "smooth-scrollbar/plugins/overscroll";
import Scrollbar from "react-smooth-scrollbar";
SmoothScrollbar.use(OverscrollPlugin);

export default function Scroll() {
  return (
    <>
      <Scrollbar
        speed={100}
        damping={0.1}
        thumbMinSize={20}
        renderByPixels={true}
        continuousScrolling={true}
        className="scroll"
      >
        <Routing />
      </Scrollbar>
    </>
  );
}
