import React from "react";

import { BrowserRouter as Router } from "react-router-dom";

import Global from "./Global/Context";

import "./App.scss";

function App() {
  return (
      <Router>
        <Global />
      </Router>
  );
}

export default App;
