import React, { useReducer, createContext, useEffect } from "react";

import userReducer, { initState } from "../Reducers/userReducer";

import Scroll from "./Scroll";
import NavBar from "../Components/Header/NavBar";

export const UserContext = createContext();

export default function Global() {
  const [userState, dispatchUser] = useReducer(userReducer, initState);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatchUser({ type: "ADD_USER", payload: user });
    }
  }, []);
  return (
    <div className="smooth-scroll">
      <UserContext.Provider value={{ userState, dispatchUser }}>
        <NavBar />
        <Scroll />
      </UserContext.Provider>
    </div>
  );
}
