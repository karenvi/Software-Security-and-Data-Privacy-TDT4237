import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import AuthService from "../services/auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const LoginForm = ({ setUser, setAppSnackbarOpen, setAppSnackbarText }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [resetUser, setResetUser] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleResetClose = () => {
    setOpen(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const onForgotPassword = (e) => {
    e.preventDefault();

    const request = { username: resetUser, email: email };

    AuthService.forgotPassword(request)
      .then((response) => {
        setOpen(false);

        console.log("Forgot password request sent");
        setResetUser("");
        setEmail("");
        setAppSnackbarText("If the user exist, a reset link has been sent.");
        setAppSnackbarOpen(true);
      })
      .catch((err) => {
        console.log("Forgot password request failed");
      });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setUsernameErrorText("Please enter username");
    } else {
      setUsernameErrorText("");
    }
    if (!password) {
      setPasswordErrorText("Please enter password");
    } else {
      setPasswordErrorText("");
    }

    if (!username || !password) {
      return;
    }

    const request = { username: username, password: password };

    AuthService.login(request)
      .then((response) => {
        console.log("Signed in successfully");
        setUsername("");
        setPassword("");
        setUser(response.user);
        if (response.user.is_staff) {
          navigate("/approve-certifications");
        } else {
          navigate("/help-requests");
        }
        setAppSnackbarText("Signed in successfully");
        setAppSnackbarOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setSnackbarOpen(true);
        setUsernameErrorText("Wrong username or password");
        setPasswordErrorText("Wrong username or password");
      });
  };

  return (
    <>
      <Container maxWidth='xs'>
        <Stack spacing={2} padding={2}>
          <img alt='logo' src='logo512primary.png' />
        </Stack>
        {
          <form onSubmit={onSubmit}>
            <Stack spacing={2} padding={2}>
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
                label='Password'
                type='password'
                onInput={(e) => setPassword(e.target.value)}
                value={password}
                error={!!passwordErrorText}
                helperText={passwordErrorText}
              ></TextField>
              <Button variant='contained' type='submit'>
                Sign In
              </Button>
              <Link
                component='button'
                underline='hover'
                onClick={() => navigate("/signup")}
              >
                Not registered? Click here to sign up!
              </Link>

              <Link
                component='button'
                underline='hover'
                onClick={handleClickOpen}
              >
                Forgot Password?
              </Link>
            </Stack>
          </form>
        }
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity='error' sx={{ width: "100%" }}>
            Login Failed! Please check you credentials.
          </Alert>
        </Snackbar>

        <Dialog open={open} onClose={handleResetClose}>
          <form onSubmit={onForgotPassword}>
            <DialogTitle>Forgot Password?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To receive a password reset link, please enter your email and
                username.
              </DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Email Address'
                type='email'
                onInput={(e) => setEmail(e.target.value)}
                value={email}
                fullWidth
                variant='standard'
                required
              />
              <TextField
                autoFocus
                required
                margin='dense'
                id='name'
                onInput={(e) => setResetUser(e.target.value)}
                value={resetUser}
                label='Username'
                fullWidth
                variant='standard'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleResetClose}>Cancel</Button>
              <Button type='submit'>Submit</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </>
  );
};

export default LoginForm;
