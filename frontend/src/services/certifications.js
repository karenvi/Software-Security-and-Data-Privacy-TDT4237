import api from "./api";

const GetCertificationRequests = () => {
  const request = api.get("/certifications/");
  return request.then((response) => response.data);
};

const DeleteCertificationRequest = (id) => {
  const request = api.delete(`/certifications/${id}`);
  return request.then((response) => response.data);
};

const CreateCertificationRequest = (data) => {
  const request = api.post("/certifications/", data);
  return request.then((response) => response.data);
};

const AnswerCertificationRequest = (data) => {
  const request = api.post("/certifications/answer/", data);
  return request.then((response) => response.data);
};

const CertificationsService = {
  GetCertificationRequests,
  DeleteCertificationRequest,
  CreateCertificationRequest,
  AnswerCertificationRequest,
};

export default CertificationsService;
