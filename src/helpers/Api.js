import Axios from "axios";
import { removeSession } from "./Session";

const ApiClient = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 2000,
  withCredentials: true,
});

ApiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // I don't know yet if this is a good idea
    if (error.response?.status === 401) {
      removeSession();
    }
    return Promise.reject(error);
  }
);

export default ApiClient;
