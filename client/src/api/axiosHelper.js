import axios from "axios";
const API_URL = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4001/auth",
  headers: {
    "Content-Type": "application/json",
  },
});
export default API_URL;
