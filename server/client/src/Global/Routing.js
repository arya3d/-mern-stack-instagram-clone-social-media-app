import React from "react";

import { Route, useHistory } from "react-router-dom";

import { routes } from "../Routes/routes";

export default function Routing() {
  return (
      <div className="bodyContainer">
        {routes.map(({ name, path, Component }) => (
          <Route key={name} path={path} exact>
            <Component />
          </Route>
        ))}
      </div>
  );
}
