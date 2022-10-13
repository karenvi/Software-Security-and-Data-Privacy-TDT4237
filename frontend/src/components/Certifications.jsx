import React, { useState, useEffect } from "react";
import CertificationsService from "../services/certifications";
import Certification from "./Certification";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";
const Certifications = () => {
  const [certifications, setCertifications] = useState(null);

  const Update = () => {
    CertificationsService.GetCertificationStatus()
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
    <Container maxWidth='md'>
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
        <Grid
          key={"Medical" + certifications?.MEDICAL.status} // Force key change when status changes to rerender
          item
          xs={12}
          md={6}
        >
          <Certification
            update={Update}
            serviceType='Medical'
            initialStatus={certifications?.MEDICAL.status}
            imagePath='medical.png'
            id={certifications?.MEDICAL.id}
          />
        </Grid>

        <Grid
          key={"Transport" + certifications?.TRANSPORT.status}
          item
          xs={12}
          md={6}
        >
          <Certification
            update={Update}
            serviceType='Transport'
            initialStatus={certifications?.TRANSPORT.status}
            imagePath='transport.png'
            date=''
            id={certifications?.TRANSPORT.id}
          />
        </Grid>
        <Grid key={"Food" + certifications?.FOOD.status} item xs={12} md={6}>
          <Certification
            update={Update}
            serviceType='Food'
            initialStatus={certifications?.FOOD.status}
            imagePath='food.png'
            date=''
            id={certifications?.FOOD.id}
          />
        </Grid>
        <Grid
          key={"Shelter" + certifications?.SHELTER.status}
          item
          xs={12}
          md={6}
        >
          <Certification
            update={Update}
            serviceType='Shelter'
            initialStatus={certifications?.SHELTER.status}
            imagePath='shelter.png'
            date=''
            id={certifications?.SHELTER.id}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Certifications;
