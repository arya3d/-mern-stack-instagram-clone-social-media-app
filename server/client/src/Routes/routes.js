import Home from "./Home";
import Auth from "./Auth";
import Post from "./Post";

import Profile from "../Components/Profile/UserProfile";
import Upload from "../Components/Profile/Upload";

import SignUpForm from "../Components/Auth/SignUpForm";
import LoginForm from "../Components/Auth/LoginForm";

export const routes = [
  { path: "/", name: "home", Component: Home },
  { path: "/followed", name: "followed", Component: Home },
  { path: "/signup", name: "signup", Component: Auth },
  { path: "/login", name: "login", Component: Auth },
  { path: "/profile/:userId", name: "profile", Component: Profile },
  { path: "/profile", name: "profile", Component: Profile },
  { path: "/upload", name: "upload", Component: Upload },
  { path: "/post/:postId", name: "post", Component: Post },
];

export const authRoutes = [
  { path: "/signup", name: "signup", Component: SignUpForm },
  { path: "/login", name: "login", Component: LoginForm },
];
