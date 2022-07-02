const getLocalRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

const setLocalRefreshToken = (token) => {
  localStorage.setItem("refresh_token", token);
};

const getLocalAccessToken = () => {
  return localStorage.getItem("access_token");
};

const updateLocalAccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const setUser = (user) => {
  console.log(JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

const TokenService = {
  getLocalRefreshToken,
  setLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getUser,
  setUser,
  removeUser,
};

export default TokenService;
