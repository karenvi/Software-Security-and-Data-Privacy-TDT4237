import { Box, Stack, Typography, Snackbar } from "@mui/material";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import MuiAlert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DocumentService from "../services/documents";
const Documents = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });
  const OpenSnackbar = (text) => {
    setSnackbarText(text);
    setSnackbarOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const uploadFile = (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("document", selectedFile);
    DocumentService.UploadDocument(formData)
      .then((response) => {
        console.log("File uploaded");
        OpenSnackbar("File uploaded");
        DocumentService.GetDocumentInfos().then((c) => setDocuments(c));
      })
      .catch((error) => console.error(error));
  };

  const downloadFile = (url) => {
    DocumentService.DownloadDocument(url)
      .then((response) => {
        const file = new File([response], url, { type: response.type });
        window.open(URL.createObjectURL(file));
      })
      .catch((error) => console.error(error));
  };

  const deleteFile = (id) => {
    DocumentService.DeleteDocument(id)
      .then((response) => {
        console.log("Deleted file");
        OpenSnackbar("Deleted file");
        setDocuments(documents.filter((file) => file.id !== id));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    DocumentService.GetDocumentInfos().then((c) => setDocuments(c));
  }, []);

  return (
    <>
      <Stack alignItems='center' spacing={1} marginTop={2}>
        <Typography variant='h2'>Documents</Typography>
        <Typography variant='h6'>
          Here you upload new documents and access your previously uploaded
          documents
        </Typography>

        <Button variant='contained' component='label'>
          Choose File
          <input
            hidden
            type='file'
            onChange={(e) => setSelectedFile(e.target.files[0])}
          ></input>
        </Button>
        <Typography variant='h6'>
          {selectedFile ? selectedFile.name : "No file selected"}
        </Typography>

        <Button
          variant='contained'
          disabled={!selectedFile}
          onClick={uploadFile}
        >
          Upload File
        </Button>
      </Stack>

      <Stack marginTop={5} alignItems='center'>
        <Typography variant='h4'>Your Documents</Typography>
        <Typography variant='h6'>
          Click the file name to download the file, or click the delete icon to
          delete the file
        </Typography>
        <Box>
          {documents.map((document) => (
            <Stack
              key={document.id}
              direction='row'
              alignItems='center'
              justifyContent='space-between'
            >
              <Button
                underline='hover'
                component='button'
                onClick={() => downloadFile(document.link)}
              >
                {document.name}
              </Button>
              <IconButton size='small' onClick={() => deleteFile(document.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
        </Box>
      </Stack>
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
    </>
  );
};

export default Documents;
