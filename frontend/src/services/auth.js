import api from "./api";
import TokenService from "./token";

const createUser = (credentials) => {
  return api.post(`/register/`, credentials).then((response) => {
    if (response.data.access) {
      TokenService.setUser(response.data.user);
      TokenService.updateLocalAccessToken(response.data.access);
      TokenService.setLocalRefreshToken(response.data.refresh);
    }

    return response.data;
  });
};

const login = (credentials) => {
  return api.post("/login/", credentials).then((response) => {
    if (response.data.access) {
      TokenService.setUser(response.data.user);
      TokenService.updateLocalAccessToken(response.data.access);
      TokenService.setLocalRefreshToken(response.data.refresh);
    }

    return response.data;
  });
};

const forgotPassword = (credentials) => {
  const request = api.post("/request-reset-password/", credentials);

  return request.then((response) => response.data);
};

const newPassword = (data) => {
  const request = api.post(`/reset-password-validate/`, data);

  return request.then((response) => response.data);
};

const logout = () => {
  TokenService.removeUser();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  createUser,
  login,
  forgotPassword,
  newPassword,
  logout,
  getCurrentUser,
};

export default AuthService;
