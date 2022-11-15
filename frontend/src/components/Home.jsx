import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
const Home = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      if (user.is_staff) {
        navigate("/approve-certifications");
      } else {
        navigate("/help-requests");
      }
    }
  }, [navigate, setUser]);

  return (
    <Container maxWidth='xl'>
      <Stack
        spacing={2}
        padding={2}
        justifyContent='center'
        alignItems='center'
      >
        <Typography sx={{ textAlign: "center" }} variant='h4'>
          Welcome to SecureHelp, the best application for securely managing
          voluntary work.
        </Typography>
        <img
          alt='logo'
          align='center'
          src='logo512primary.png'
          width='300'
          height='300'
        />
        <Typography sx={{ textAlign: "center" }} variant='body'>
          Register for voluntary work or as a refugee here!
        </Typography>
        <Button onClick={() => navigate("/signup")} variant='contained'>
          Click here to sign up
        </Button>
        <Link
          component='button'
          underline='hover'
          onClick={() => navigate("/login")}
        >
          Already registered? Click here to sign in!
        </Link>
      </Stack>
    </Container>
  );
};

export default Home;
