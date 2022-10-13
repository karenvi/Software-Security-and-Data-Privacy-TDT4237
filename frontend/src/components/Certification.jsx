import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import CertificationsService from "../services/certifications";

const Certification = ({
  serviceType,
  initialStatus,
  imagePath,
  id,
  update,
}) => {
  const [status, setStatus] = useState(initialStatus);
  const ApplyForCertification = () => {
    const data = {
      competence: serviceType.toUpperCase(),
    };
    CertificationsService.CreateCertificationRequest(data)
      .then((response) => {
        console.log("Certification request created successfully!");
        update();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const CancelCertificationRequest = () => {
    CertificationsService.DeleteCertificationRequest(id)
      .then((response) => {
        console.log("Certification request deleted successfully!");
        setStatus(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card sx={{ maxWidth: 450 }}>
      <CardMedia
        component='img'
        alt='illustration'
        height='230'
        image={imagePath}
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {serviceType}
        </Typography>
        <Typography variant='H6' color='text.secondary'>
          {status === "P" ? "You request is pending..." : null}
          {status === "A" ? "You are certified!" : null}
          {status === "D"
            ? "Your request has been declined :(  Contact an administrator if you believe you should be accepted"
            : null}
          {status === null
            ? "Press the button below to apply for certification"
            : null}
        </Typography>
      </CardContent>
      <Stack alignItems='center'>
        <CardActions>
          {status === "P" ? (
            <Button
              variant='contained'
              color='secondary'
              size='small'
              onClick={CancelCertificationRequest}
            >
              Cancel request
            </Button>
          ) : null}

          {status === "A" ? (
            <Button
              variant='contained'
              color='secondary'
              size='small'
              onClick={CancelCertificationRequest}
            >
              Resign certification
            </Button>
          ) : null}

          {status === null ? ( // status is null if the user has not applied for this certification
            <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={ApplyForCertification}
            >
              Apply for certification
            </Button>
          ) : null}
        </CardActions>
      </Stack>
    </Card>
  );
};

export default Certification;
