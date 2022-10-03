import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";

const Invalid = (props) => {
  const navigate = useNavigate();
  return (
    <Container>
      <Stack justifyContent='center' spacing={2} marginTop={3}>
        <Typography sx={{ textAlign: "center" }} variant='h1'>
          Invalid link
        </Typography>

        <Link
          component='button'
          underline='hover'
          onClick={() => navigate("/signup")}
        >
          Not registered? Click here to sign up!
        </Link>
      </Stack>
    </Container>
  );
};
export default Invalid;
