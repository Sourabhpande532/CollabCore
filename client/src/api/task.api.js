import API_URL from "./axiosHelper";

export const getTasks = (params) => API_URL.get("/tasks", { params });
export const createTask = (data) => API_URL.post("/tasks", data);
