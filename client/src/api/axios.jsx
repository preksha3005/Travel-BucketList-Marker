import axios from "axios";

// console.log("BACKEND:", process.env.REACT_APP_BACKEND_URL);

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

export default api;
