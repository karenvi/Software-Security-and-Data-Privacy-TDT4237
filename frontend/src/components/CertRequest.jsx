import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import React from "react";
import CertificationsService from "../services/certifications";

const CertRequest = ({ certRequest, update, OpenSnackbar }) => {
  const AnswerRequest = (answer) => {
    CertificationsService.AnswerCertificationRequest({
      id: certRequest.id,
      status: answer,
    })
      .then((response) => {
        console.log("Certification request answered");
        update();
        OpenSnackbar("Certification request answered");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card
      sx={{
        position: "relative",
        height: 220,
        width: 250,
      }}
    >
      <CardContent>
        <Typography variant='h4' component='div'>
          {certRequest.competence}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary' variant='h6'>
          Pending request
        </Typography>
        <Typography variant='h6'>Volunteer: {certRequest.user}</Typography>
      </CardContent>
      <CardActions>
        <Stack spacing={4} marginLeft={3} direction='row'>
          <Button
            size='small'
            variant='contained'
            color='secondary'
            onClick={() => AnswerRequest("D")}
          >
            Decline
          </Button>
          <Button
            size='small'
            variant='contained'
            color='primary'
            onClick={() => AnswerRequest("A")}
          >
            Accept
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default CertRequest;
