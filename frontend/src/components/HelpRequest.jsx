import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Stack,
  Popover,
} from "@mui/material";
import React, { useState } from "react";
import HelpRequestService from "../services/helpRequests";
import DocumentService from "../services/documents";

const HelpRequest = ({ helpRequest, update, OpenSnackbar, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [documents, setDocuments] = useState([]);

  const handleClick = (event, refugeeId) => {
    setAnchorEl(event.currentTarget);
    DocumentService.GetRefugeeDocumentInfos(refugeeId)
      .then((c) => setDocuments(c))
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const downloadFile = (url) => {
    DocumentService.DownloadDocument(url)
      .then((response) => {
        const file = new File([response], url, { type: response.type });
        window.open(URL.createObjectURL(file));
      })
      .catch((error) => console.error(error));
  };

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

        <Stack alignItems='center' justifyContent='center' direction='row'>
          {helpRequest.volunteer != null && user.is_volunteer ? (
            <>
              <Button
                variant='outlined'
                aria-describedby={id}
                onClick={(e) => handleClick(e, helpRequest.refugee)}
              >
                Show Documents{" "}
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Stack
                  direction='column'
                  alignItems='center'
                  justifyContent='center'
                >
                  {documents.length ? (
                    documents.map((document) => (
                      <Button
                        key={document.id}
                        onClick={() => downloadFile(document.link)}
                      >
                        {document.name}
                      </Button>
                    ))
                  ) : (
                    <Typography variant='h6'>
                      {helpRequest.refugee} has no documents
                    </Typography>
                  )}
                </Stack>
              </Popover>
            </>
          ) : null}
        </Stack>
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
