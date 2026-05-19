import axios from "axios";

const getAuthHeader = () => {
  const credentials = localStorage.getItem("credentials");
  return credentials ? { Authorization: `Basic ${credentials}` } : {};
};

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach Basic Auth header to every request automatically
api.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    ...getAuthHeader(),
  };
  return config;
});

export default api;