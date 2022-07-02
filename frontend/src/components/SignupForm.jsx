import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import AuthService from "../services/auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Link from "@mui/material/Link";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const SignupForm = ({ setUser, setAppSnackbarOpen, setAppSnackbarText }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const request = { username: username, email: email, password: password };
    AuthService.createUser(request)
      .then((response) => {
        console.log("User registered successfully");
        setAppSnackbarText(
          "If the email exist, an activation link has been sent."
        );
        setAppSnackbarOpen(true);
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        let msg = "";
        if (err.response) {
          Object.values(err.response.data).forEach((x) => (msg += x));
          console.log(err.response);
        } else {
          msg = "Failed to get response from server.";
        }
        setSnackbarText(msg);
        setSnackbarOpen(true);
      });
  };
  return (
    <>
      <Container maxWidth='xs'>
        <form onSubmit={onSubmit}>
          <Stack spacing={2} padding={2}>
            <img alt='logo' src='' />
            <TextField
              required
              label='Username'
              onInput={(e) => setUsername(e.target.value)}
              value={username}
              error={!!usernameErrorText}
              helperText={usernameErrorText}
            />
            <TextField
              required
              label='E-mail'
              onInput={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
            />

            <TextField
              required
              label='Password'
              type='password'
              onInput={(e) => setPassword(e.target.value)}
              value={password}
              error={!!passwordErrorText}
              helperText={passwordErrorText}
            ></TextField>
            <Button variant='contained' type='submit'>
              Sign Up
            </Button>
            <Link
              component='button'
              underline='hover'
              onClick={() => navigate("/login")}
            >
              Already registered? Click here to sign in!
            </Link>
          </Stack>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity='error' sx={{ width: "100%" }}>
            {snackbarText}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default SignupForm;
