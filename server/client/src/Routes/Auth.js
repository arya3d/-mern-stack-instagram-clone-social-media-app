import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { authRoutes } from "./routes";



export default function Auth() {
  return (
    <>
      {authRoutes.map(({ name, path, Component }) => (
        <Route key={name} path={path} exact>
          <Component />
        </Route>
      ))}
    </>
  );
}
