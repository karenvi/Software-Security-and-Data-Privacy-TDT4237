import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import HelpRequestService from "../services/helpRequests";

const HelpRequest = ({ helpRequest, update, OpenSnackbar, user }) => {
  const AcceptHelpRequest = (id) => {
    HelpRequestService.AcceptHelpRequest({
      request_id: id,
    })
      .then((response) => {
        console.log("Help request accepted");
        update();
        OpenSnackbar("Help request accepted");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const FinishHelpRequest = (id) => {
    HelpRequestService.FinishHelpRequest({
      request_id: id,
    })
      .then((response) => {
        console.log("Help request finished");
        update();
        OpenSnackbar("Help request finished");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DeleteHelpRequest = (id) => {
    HelpRequestService.DeleteHelpRequest(id)
      .then((response) => {
        console.log("Help request deleted");
        update();
        OpenSnackbar("Help request deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card
      sx={{
        position: "relative",
        maxHeight: 400,
        minHeight: 200,
        width: 250,
      }}
    >
      <CardContent>
        <Typography variant='h4' component='div'>
          {helpRequest.service_type}
        </Typography>

        <Typography variant='h6'>Refugee: {helpRequest.refugee}</Typography>

        {helpRequest.volunteer ? (
          <Typography variant='h6'>
            {"Volunteer: " + helpRequest.volunteer}
          </Typography>
        ) : null}

        {!helpRequest.finished &&
        helpRequest.volunteer != null &&
        user.is_volunteer ? (
          <div>Show Refugee Documents (coming soon)</div>
        ) : null}

        <div
          dangerouslySetInnerHTML={{ __html: helpRequest.description }}
        ></div>
      </CardContent>
      <Stack alignItems='center'>
        <CardActions>
          {!user.is_volunteer && !helpRequest.finished ? (
            <Button
              size='small'
              variant='contained'
              color='secondary'
              onClick={() => DeleteHelpRequest(helpRequest.id)}
            >
              Delete Request
            </Button>
          ) : !helpRequest.finished && helpRequest.volunteer == null ? (
            <Button
              size='small'
              variant='contained'
              color='primary'
              onClick={() => AcceptHelpRequest(helpRequest.request_id)}
            >
              Accept
            </Button>
          ) : null}

          {!helpRequest.finished &&
          helpRequest.volunteer != null &&
          user.is_volunteer ? (
            <Button
              size='small'
              variant='contained'
              color='primary'
              onClick={() => FinishHelpRequest(helpRequest.id)}
            >
              Finish
            </Button>
          ) : null}
        </CardActions>
      </Stack>
    </Card>
  );
};

export default HelpRequest;
