import { Container, Grid, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React, { useState, useEffect } from "react";
import CertificationsService from "../services/certifications";
import CertRequest from "./CertRequest";
const ApproveCerts = () => {
  const [certifications, setCertifications] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const OpenSnackbar = (text) => {
    setSnackbarText(text);
    setSnackbarOpen(true);
  };

  const Update = () => {
    CertificationsService.GetCertificationRequests()
      .then((response) => {
        setCertifications(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    Update();
  }, []);

  return (
    <Container>
      <Typography sx={{ textAlign: "center", marginTop: 3 }} variant='h2'>
        Answer Certification Requests
      </Typography>
      <Typography
        sx={{ textAlign: "center", marginTop: 3 }}
        variant='h5'
        color='text.secondary'
      >
        Welcome, administrator! Approve or deny certification requests here.
      </Typography>

      <Grid container padding={2} spacing={5} justifyContent='center'>
        {certifications
          ?.filter((c) => c.status === "P")
          .map((c) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={c.id}>
              <CertRequest
                key={c.id}
                certRequest={c}
                update={Update}
                OpenSnackbar={OpenSnackbar}
              />
            </Grid>
          ))}
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: "100%" }}>
          {snackbarText}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ApproveCerts;
