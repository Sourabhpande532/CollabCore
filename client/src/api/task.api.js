import API_URL from "./axiosHelper";

export const getTasks = (params) => API_URL.get("/tasks", { params });
export const createTask = (data) => API_URL.post("/tasks", data);
// export const getUsers = () => API_URL.get("/me");
export const getUsers = () => API_URL.get("/users");
