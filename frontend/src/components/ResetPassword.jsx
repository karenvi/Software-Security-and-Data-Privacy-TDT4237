import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import AuthService from "../services/auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useLocation } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const ResetPassword = () => {
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const [failSnackbarOpen, setFailSnackbarOpen] = useState(false);

  const handleFailClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFailSnackbarOpen(false);
  };

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password1) {
      setPasswordErrorText("Passwords must match");
      return;
    }
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const uid = params.get("uid");

    const request = {
      password: password,
      password1: password1,
      uid: uid,
      token: token,
    };

    AuthService.newPassword(request)
      .then((response) => {
        console.log(response);
        if (response.success) {
          setSnackbarOpen(true);
          setPasswordErrorText("");
        }
      })
      .catch((error) => {
        const msg = error.response.data;

        if (msg["message"]) {
          setErrorMessage(msg["message"]);
        }
        setFailSnackbarOpen(true);
      });
  };
  return (
    <Container maxWidth='xs'>
      <form onSubmit={onSubmit}>
        <Stack spacing={2} padding={2}>
          <img alt='logo' src='/logo512primary.png' />
          <TextField
            required
            label='Password'
            type='password'
            onInput={(e) => setPassword(e.target.value)}
            value={password}
          />

          <TextField
            required
            label='Confirm Password'
            type='password'
            onInput={(e) => setPassword1(e.target.value)}
            value={password1}
            error={!!passwordErrorText}
            helperText={passwordErrorText}
          ></TextField>
          <Button variant='contained' type='submit'>
            Reset password
          </Button>
        </Stack>
      </form>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: "100%" }}>
          Password successfully reset
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={failSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleFailClose}
      >
        <Alert
          onClose={handleFailClose}
          severity='error'
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResetPassword;
