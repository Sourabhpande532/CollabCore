import API_URL from "./axiosHelper";
export const getProjects = () => API_URL.get("/projects");
export const createProject = (data) => API_URL.post("/projects", data);
