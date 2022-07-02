import axios from "axios";
import TokenService from "./token";

const instance = axios.create({
  baseURL:  process.env.REACT_APP_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
       config.headers["Authorization"] = 'Bearer ' + token;  
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/login/" && err.response && originalConfig.url !== "/refresh/") {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await instance.post("/refresh/", {
            refresh: TokenService.getLocalRefreshToken(),
          });
        
          const  accessToken  = rs.data.access;
          TokenService.updateLocalAccessToken(accessToken);

          return instance(originalConfig);
        } catch (_error) {
            console.log(_error)
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;