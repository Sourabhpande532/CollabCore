import axios from "axios";
const API_URL = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "https://collab-core.vercel.app/auth",
  headers: {
    "Content-Type": "application/json",
  },
});
export default API_URL;
