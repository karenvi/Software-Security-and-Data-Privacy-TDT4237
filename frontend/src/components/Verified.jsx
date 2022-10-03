import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";

const Verified = (props) => {
  const navigate = useNavigate();
  return (
    <Container>
      <Stack justifyContent='center' spacing={2} marginTop={3}>
        <Typography sx={{ textAlign: "center" }} variant='h1'>
          User successfully verified!
        </Typography>
        <Typography sx={{ textAlign: "center" }} variant='h5'>
          You can now log in to the application.
        </Typography>
        <Link
          component='button'
          underline='hover'
          onClick={() => navigate("/login")}
        >
          Click here to go to the login page
        </Link>
      </Stack>
    </Container>
  );
};
export default Verified;
