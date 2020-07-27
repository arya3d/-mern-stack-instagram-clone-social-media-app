import React, { useState, useContext } from "react";

import { UserContext } from "../../Global/Context";

import { useHistory, Link } from "react-router-dom";

import axios from "axios";

import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link as MLink,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
} from "@material-ui/core";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ToggleIcon from "material-ui-toggle-icon";

import { validateEmail } from "../../Utils/Validation";

import { standardNotification } from "../../Utils/Notifications";
import { disableButton, BackDropLoader } from "../../Utils/UserExp";

export default function LoginForm() {
  const history = useHistory();
  const { dispatchUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false);

  const checkCredentials = async () => {
    try {
      if (!password || !email) {
        standardNotification("Fill out all the required fields", "warning");
        return;
      } else if (!validateEmail(email)) {
        standardNotification("Email is not valid", "error");
        return;
      }

      setLoading(true);
      const loginRes = await axios.post("/login", {
        email,
        password,
      });

      // User with the same email existence validation
      if (loginRes.data.error) {
        setLoading(false);
        standardNotification(loginRes.data.error, "error");
        return;
      }
      localStorage.setItem("jwt", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      dispatchUser({ type: "ADD_USER", payload: loginRes.data.user });

      setLoading(false);
      history.push("/");
      standardNotification("Welcome back :)", "info");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="auth-container">
      {loading && <BackDropLoader loading={loading} />}
      <div>
        <Typography component="h1" variant="h5" className="auth-title">
          Login
        </Typography>
        <form noValidate>
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            autoFocus={true}
            label="Email Address"
            className="auth-login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl
            id="auth-signup-form-control"
            className="auth-signup-input"
          >
            <InputLabel htmlFor="standard-adornment-password">
              Password *
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={visible ? "text" : "password"}
              required
              fullWidth
              className="auth-signup-input auth-text-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setVisible(!visible)}>
                    <ToggleIcon
                      on={visible}
                      onIcon={<Visibility />}
                      offIcon={<VisibilityOff />}
                    />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              className="auth-form-control-label"
            />
          </Grid>
          <Button
            fullWidth
            variant="contained"
            className="primary auth-btn"
            onClick={() => {
              checkCredentials();
              disableButton(loginButtonDisabled, setLoginButtonDisabled);
            }}
            disabled={loginButtonDisabled}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <MLink variant="body2">Forgot password?</MLink>
            </Grid>
            <Grid item>
              <MLink variant="body2">
                <Link to="/signup" className="link">
                  {"Don't have an account? Sign Up"}
                </Link>
              </MLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
}
