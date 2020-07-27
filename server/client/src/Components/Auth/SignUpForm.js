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
  InputLabel,
  InputAdornment,
  IconButton,
  Input,
  FormControl,
} from "@material-ui/core";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ToggleIcon from "material-ui-toggle-icon";

import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../Utils/Validation";

import { standardNotification } from "../../Utils/Notifications";
import { disableButton, BackDropLoader } from "../../Utils/UserExp";

export default function SignUpForm() {
  const history = useHistory();

  const { dispatchUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const [signupButtonDisabled, setSignupButtonDisabled] = useState(false);

  const saveCredentials = async () => {
    try {
      if (!name || !password || !email) {
        standardNotification("Fill out all the required fields", "warning");
      } else if (!validateUsername(name)) {
        standardNotification("Username is not valid", "error");
        return;
      } else if (!validateEmail(email)) {
        standardNotification("Email is not valid", "error");
        return;
      } else if (!validatePassword(password)) {
        standardNotification("Password is week", "error");
        return;
      }
      setLoading(true);
      const signupRes = await axios.post("/signup", {
        name,
        email,
        password,
      });

      // User with the same email existence validation
      if (signupRes.data.error) {
        setLoading(false);
        standardNotification(signupRes.data.error, "error");
        return;
      }

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

      standardNotification(`Welcome to Linx ${name} :)`, "info");

      history.push("/");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="auth-container">
      {loading && <BackDropLoader loading={loading} />}
      <Typography component="h1" variant="h5" className="auth-title">
        Sign up
      </Typography>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="standard"
              required
              fullWidth
              label="User Name"
              autoFocus={true}
              className="auth-signup-input auth-text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              required
              fullWidth
              label="Email Address"
              className="auth-signup-input auth-text-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl
              id="auth-signup-form-control"
              className="auth-signup-input"
            >
              <InputLabel
                htmlFor="standard-adornment-password"
                // className="auth-password-label"
              >
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
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive inspiration, marketing promotions and updates via email."
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          className="primary auth-btn"
          onClick={() => {
            saveCredentials();
            disableButton(signupButtonDisabled, setSignupButtonDisabled);
          }}
          disabled={signupButtonDisabled}
        >
          Sign Up
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <MLink variant="body2">
              <Link to="/login" className="link">
                Already have an account ? Login
              </Link>
            </MLink>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
