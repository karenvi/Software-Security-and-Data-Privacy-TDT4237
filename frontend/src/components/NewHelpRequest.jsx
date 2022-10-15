import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import HelpRequestService from "../services/helpRequests";
import { Typography } from "@mui/material";
const NewHelpRequest = React.forwardRef((props, ref) => {
  const ServiceTypes = ["MEDICAL", "TRANSPORT", "FOOD", "SHELTER"];

  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 1000,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      service_type: serviceType,
      description: description,
    };
    HelpRequestService.CreateHelpRequest(data)
      .then((response) => {
        props.update();
        props.OpenSnackbar("Help Request created");
        props.handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box ref={ref} sx={style} tabIndex={-1}>
      <Typography variant='h4' component='div'>
        Create New Help Request
      </Typography>

      <form onSubmit={onSubmit}>
        <Stack spacing={2} direction='column'>
          <Typography variant='body' component='div' marginTop={2}>
            Select the type of help you need, and write a description.
          </Typography>
          <FormControl required fullWidth>
            <InputLabel id='service-input-label'>Service Type</InputLabel>
            <Select
              labelId='service-input-label'
              id='service-select'
              value={serviceType}
              label='Service Type'
              onChange={handleServiceTypeChange}
            >
              {ServiceTypes.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            id='description-field'
            label='Description'
            variant='outlined'
            multiline
            minRows={2}
            required
            value={description}
            onInput={(e) => setDescription(e.target.value)}
          />
          <Stack spacing={2} direction='row' justifyContent='center'>
            <Button
              variant='contained'
              onClick={props.handleClose}
              color='secondary'
            >
              Cancel
            </Button>
            <Button variant='contained' type='submit'>
              Submit Request
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
});

export default NewHelpRequest;
