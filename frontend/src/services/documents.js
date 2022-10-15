import api from "./api";

const UploadDocument = (data) => {
  const request = api.post("/documents/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return request.then((response) => response.data);
};

const GetDocumentInfos = () => {
  const request = api.get("/documents/");
  return request.then((response) => response.data);
};

const DownloadDocument = (url) => {
  const request = api.get(url, { responseType: "blob" });
  return request.then((response) => response.data);
};

const DeleteDocument = (id) => {
  const request = api.delete(`/documents/${id}/`);
  return request.then((response) => response.data);
};

const GetRefugeeDocumentInfos = (id) => {
  const request = api.get(`/refugee-documents/${id}/`);
  return request.then((response) => response.data);
};

const DocumentService = {
  UploadDocument,
  GetDocumentInfos,
  DownloadDocument,
  DeleteDocument,
  GetRefugeeDocumentInfos,
};

export default DocumentService;
