import React, { useState, useEffect } from "react";
import CertificationsService from "../services/certifications";
import Certification from "./Certification";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
const Certifications = ({ user }) => {
  return (
    <>
      <Typography sx={{ textAlign: "center", marginTop: 3 }} variant='h2'>
        Certifications
      </Typography>
      <Typography
        sx={{ textAlign: "center", marginTop: 3 }}
        variant='h4'
        color='text.secondary'
      >
        View your certifications and apply for more here!
      </Typography>
      <Grid marginTop={1} container spacing={5} justifyContent='center'>
        <Grid key={0} item xs={12} md={6}>
          <Certification
            serviceType='Medical'
            initialStatus='P'
            imagePath='logo512primary.png'
            date=''
            id={3}
          />
        </Grid>

        <Grid key={1} item xs={12} md={6}>
          <Certification
            serviceType='Transport'
            initialStatus='A'
            imagePath='logo512primary.png'
            date=''
          />
        </Grid>
        <Grid key={2} item xs={12} md={6}>
          <Certification
            serviceType='Food'
            initialStatus='D'
            imagePath='logo512primary.png'
            date=''
          />
        </Grid>
        <Grid key={3} item xs={12} md={6}>
          <Certification
            serviceType='Shelter'
            initialStatus={null}
            imagePath='logo512primary.png'
            date=''
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Certifications;
