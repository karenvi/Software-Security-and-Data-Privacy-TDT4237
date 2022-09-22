import api from "./api";

const GetHelpRequests = () => {
  const request = api.get("/help_requests/");
  return request.then((response) => response.data);
};

const DeleteHelpRequest = (id) => {
  const request = api.delete(`/help_requests/${id}/`);
  return request.then((response) => response.data);
};

const CreateHelpRequest = (data) => {
  const request = api.post("/help_requests/", data);
  return request.then((response) => response.data);
};

const AcceptHelpRequest = (data) => {
  const request = api.post(`/help_requests/accept/`, data);
  return request.then((response) => response.data);
};

const FinishHelpRequest = (data) => {
  const request = api.post(`/help_requests/finish/`, data);
  return request.then((response) => response.data);
};

const HelpRequestService = {
  GetHelpRequests,
  DeleteHelpRequest,
  CreateHelpRequest,
  AcceptHelpRequest,
  FinishHelpRequest,
};

export default HelpRequestService;
